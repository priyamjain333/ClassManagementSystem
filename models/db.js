const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/dbmsnodeproj',{useNewUrlParser:true},(err)=>{
if(!err){console.log('MongoDB connection Succeeded');}
else {
  console.log('error in connection:'+ err);
}
});
require('./students.model');
require('./studentusernames.model');
require('./teacherusernames.model');
require('./teachers.model');
require('./meetings.model');
