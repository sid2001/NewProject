const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email:{
    type: String,
    required:true
  },
  name:{
    first:{
      type:String,
      required:true
    },
    last:{
      type:String
    },
  },
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  }
})

module.exports = mongoose.model('User',userSchema);