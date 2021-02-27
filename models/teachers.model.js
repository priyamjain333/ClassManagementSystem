const mongoose=require('mongoose');
var teacherDetails=new mongoose.Schema({
  tid:{
    type: String
    //required: 'This Field Is Required'
  },
  tname:{
    type: String
  },
  temail:{
    type: String
  },
  tbatch:{
    type: Array
  },
  tdept:{
    type:String
  }

});

mongoose.model('teacherDetails',teacherDetails);
