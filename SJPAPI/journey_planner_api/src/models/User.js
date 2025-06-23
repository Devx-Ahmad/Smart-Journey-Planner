const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
});
userSchema.index({email: 1});

const User = mongoose.model('Data', userSchema);

module.exports = User;
