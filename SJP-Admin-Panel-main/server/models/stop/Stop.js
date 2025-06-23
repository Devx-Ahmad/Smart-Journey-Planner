const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const stopSchema = new Schema({
  stopId: {
  type: String, 
  required: true, 
  unique: true
  },
  stopName: {
     type: String,
     required: true
   },
  latitude: { 
    type: Number, 
    required: true 
  },
  longitude: { 
    type: Number, 
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports =  mongoose.model('Stop', stopSchema);
