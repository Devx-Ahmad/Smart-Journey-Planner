const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import User model

const router = express.Router();

// POST route to register a new user
router.post('/register', async (req, res) => {
  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({error: 'Please fill in all fields'});
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({email});
    if (userExists) {
      return res.status(400).json({error: 'User already exists'});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Send success response
    res.status(201).json({message: 'Registration successful'});
  } catch (error) {
    res.status(500).json({error: 'Server error'});
  }
});

// POST route for login
router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({error: 'Please provide email and password'});
  }

  try {
    // Check if the user exists
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({error: 'Invalid credentials'});
    }

    // Send the successful login response with user details only once
    res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    // Ensure no response is sent twice
    if (!res.headersSent) {
      res.status(500).json({error: 'Server error'});
    }
  }
});

module.exports = router;
