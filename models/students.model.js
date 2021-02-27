const mongoose=require('mongoose');
var saddress=new mongoose.Schema({
  area:{
    type: String
  },
  city:{
    type:String
  },
  state:{
    type:String
  }

});
var studentPersonalDetails=new mongoose.Schema({
  sid:{
    type: String
  },
  sroll:{
    type: String
  },
  sname:{
    type: String
  },
  semail:{
    type: String
  },
  sbatch:{
    type: String
  },
  saddress:[saddress],
  sphone:{
    type:String
  },
  sbg:{
    type:String
  },
  sachieve:{
    type: String
  }
});

mongoose.model('studentPersonalDetails',studentPersonalDetails);
mongoose.model('saddress',saddress);
