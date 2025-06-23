// routes/issues.js
const express = require('express');
const router = express.Router();
const Issue = require('../models/Report'); // Adjust path as necessary

// POST route to submit a new issue
router.post('/submit', async (req, res) => {
  const {description} = req.body;

  if (!description) {
    return res.status(400).json({error: 'Description is required'});
  }

  try {
    const newIssue = new Issue({
      description,
    });

    await newIssue.save();
    res
      .status(201)
      .json({message: 'Issue submitted successfully', issueId: newIssue._id});
  } catch (error) {
    res.status(500).json({error: 'Server error'});
  }
});

module.exports = router;
