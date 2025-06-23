// models/Issue.js
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  description: {type: String, required: true},
  reportedAt: {type: Date, default: Date.now},
  status: {type: String, default: 'pending'},
});

const Reports = mongoose.model('Report', issueSchema);
module.exports = Reports;
