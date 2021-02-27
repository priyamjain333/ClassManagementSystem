const mongoose=require('mongoose');
var teacherusernames=new mongoose.Schema({
  tid:{
    type: String

  },
  tpassword:{
    type: String
  }

});

mongoose.model('teacherusernames',teacherusernames);
