const mongoose=require('mongoose');
var meetings=new mongoose.Schema({
  mdate:{
    type: Date

  },
  mbatch:{
    type: String
  },
  mremarks:{
    type: String
  },
  machieve:{
    type: String
  }

});

mongoose.model('meetings',meetings);
