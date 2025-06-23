require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

const connectDB = require('./models/db');
// Import route files
const usersRoutes = require('./routes/users');
const ptRoutesRoutes = require('./routes/pt_routes');

// Express application
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../apidoc')));
// Register route files
// app.use('/users', usersRoutes);
app.use('/routes', ptRoutesRoutes);
app.use(helmet()); // for added security
// Enable rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
});
app.use('/', limiter);

// Connect to MongoDB
connectDB();

// Define the route for the home endpoint
app.get('/', (req, res) => {
  const filePath = path.resolve(__dirname, '../apidoc', 'index.html');

  // Check if the filePath is an absolute path
  if (!path.isAbsolute(filePath)) {
    return res.status(500).send('Invalid documentation file path');
  }

  // Specify the root directory explicitly
  const root = path.dirname(filePath);

  res.sendFile(path.basename(filePath), {root});
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
