const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const issueRoutes = require('./routes/report'); // Adjust path as necessary

// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To handle POST request bodies

// MongoDB connection URI (replace with your MongoDB Atlas URI)
const mongoURI =
  'mongodb+srv://ahmad:E92evt8kizyHEM34@smartjourneypalnning.ogicnlf.mongodb.net/Users';
// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// User registration route
const userRoutes = require('../backend/routes/user');
app.use('/api/users', userRoutes);

//Report issues
app.use('/api/issues', issueRoutes);

// Start the server
const port = 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
