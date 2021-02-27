const mongoose=require('mongoose');
var usernames=new mongoose.Schema({
  sroll:{
    type: String

  },
  spassword:{
    type: String
  }

});

mongoose.model('usernames',usernames);
