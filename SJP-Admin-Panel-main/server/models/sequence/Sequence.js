const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const sequenceSchema = new Schema({
  seqId: {
    type: String,
    required: true,
    unique: true
  },
  stops: [{
    stopId: {
      type: String,
    },
    seqNumber: {
      type: Number,
      required: true,
    },
  }],
  seqName: {
    type: String,
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

module.exports = mongoose.model('Path', sequenceSchema);