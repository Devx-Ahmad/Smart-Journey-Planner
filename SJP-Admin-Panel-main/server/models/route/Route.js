const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const routeSchema = new Schema({
routeId: { 
    type: String,
    required: true,
    unique: true 
},
routeName: { 
    type: String, 
    required: true 
},
seqId: { 
    type: String, 
    required: true
},
status: { 
    type: Boolean , 
    required: true
},
createdAt:
 {
    type: Date,
    default: Date.now()
},
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports =  mongoose.model('Route', routeSchema);