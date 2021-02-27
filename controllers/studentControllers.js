const express =require('express');
//now we need an router
var router=express.Router();
//in order to create an jason object we need to create object of the database schema where
const mongoose=require('mongoose');
const studentPersonalDetails=mongoose.model('studentPersonalDetails');
const usernames=mongoose.model('usernames');
const teacherusernames=mongoose.model('teacherusernames');
const teacherDetails=mongoose.model('teacherDetails');
const meetings=mongoose.model('meetings');
const saddress=mongoose.model('saddress');
var assert=require('assert');
var mongo=require('mongodb');

var expressValidator=require('express-validator');
var expressSession=require('express-session');

var url='mongodb://localhost:27017/dbmsnodeproj';


router.get('/',function(req,res,next){
  res.render("common",{viewTitle:"Select User"});
});

router.get('/st',function(req,res,next){
  //res.json('sample text');
  res.render("loginpage",{viewTitle:"Student Login" ,success:req.session.success,errors:req.session.errors });
 // req.session.errors=null;
  //req.session.success=null;
});
//teacher loginpage
router.get('/tr',function(req,res,next){
  //res.json('sample text');
  res.render("teacherloginpage",{viewTitle:"Teacher Login" ,success:req.session.success,errors:req.session.errors });
  req.session.errors=null;
  //req.session.success=null;
});
//teacher submit
router.post('/trlogin/submit',function(req,res,next){
  //check validity
  
  teacherusernames.findOne({'tid':req.body.tid},(err,doc)=>{
    if(!err)
    {
      console.log(doc);
      req.check('tid','Invalid ID, total digits should be three').isLength({min:3});
      req.check('trpassword','Incorrect password').isLength({min:4}).equals(doc.tpassword);
      if(doc.tpassword==req.body.trpassword){
        console.log("Invalid Password(do not match)");
      }
      var errors=req.validationErrors();
      var trusernameobject=new teacherusernames();
        if(errors)
          {
    
            req.session.errors=errors;
            req.session.success=false;
            res.redirect('/tr');
          }
          else{

            req.session.success=true;
            res.redirect('/trlogin/'+req.body.tid);

          }
    }
  });     
});
var globaltid='';
//opening the welcome page for teacher
router.get('/trlogin/:tid',function(req,res,next){
  globaltid=req.params.tid;
  console.log('id value stored'+ globaltid);
  var teacherObject=new teacherDetails();
  teacherDetails.findOne({'tid':req.params.tid},(err,docs)=>{
    if(!err)
    {
      console.log(docs);
      console.log(docs.tbatch);
      res.render("welcometeacherpage",{
        viewTitle:"Welcome page(home page)",
        outputid:req.params.tid,
        list: docs.tbatch
      });
    }
    else {
      {
        console.log('error in retrieving data');
      }
    }
  });
});
//getting the student details of the specific Batch
router.get('/studentdetails/:bname',function(req,res,next){
  var list=new studentPersonalDetails();
  var listbatch=new teacherDetails();
  studentPersonalDetails.find({'sbatch':req.params.bname},(err,docs)=>{
    if(!err)
    {
      console.log(docs);
      res.render("studentsdata",{
        viewTitle:"Student Record",
        batch:req.params.bname,
        listbatches:listbatch,
        list: docs

      });
    }
    else{
      console.log('error in retrieving data batch students');
    }
  });
});
//post method called to view the student data batchwise
router.post('/showstdata/:tid',function(req,res,next){
  var list=new studentPersonalDetails();
  var listbatch=new teacherDetails();
  console.log('radio='+req.body.radioinput);
  studentPersonalDetails.find({'sbatch':req.body.batchlist},(err,docs)=>{
    if(!err)
    {
      console.log(docs);
      res.render("studentsdata",{
        viewTitle:"Student Record",
        outputid:req.params.tid,
        batch:req.body.batchlist,
        listbatches:listbatch,
        list: docs
      });
    }
    else{
      console.log('error in retrieving data batch students');
    }
  });
});
router.post('/login/submit',function(req,res,next){
  //check validity
  req.check('rollnumber','Invalid Roll Number').isLength({min:4});
  req.check('password','Incorrect password');
  var errors=req.validationErrors();
  var usernameobject=new usernames();
  if(errors)
  {
    req.session.errors=errors;
    req.session.success=false;
    res.redirect('/st');
  }
  else{
    //checking the password
        usernames.findOne({'sroll':req.body.rollnumber},(err,doc)=>{
          if(!err)
          {
            console.log(doc);
            if(doc.spassword==req.body.password)
            {
              /*res.render("welcomestudentpage",{
                viewTitle:"check password",
                usernameobject: doc
              });*/
              res.redirect('/login/'+req.body.rollnumber);
            }else {
              console.log('invalid password!!!');
            }
          }
        });
      }
});
router.get('/updatemyform/:rollnumber',function(req,res,next){
  studentPersonalDetails.findOneAndUpdate({'sroll':req.params.rollnumber},req.body,{new: true},(err,doc)=>{
    if(!err)
    {
      //res.redirect('studentdetails/list');
      console.log('updation successful');
      res.redirect('/st');
    }
    else{
      if(err.name=='ValidationError')
      {
        handleValidationError(err,req.body);
        res.render("student/addOrEdit",{
          viewTitle: "Update Student Record",
          studentobject: req.body

        });
      }else {
        {
          console.log("Error during record update: " + err);
        }
      }
    }

  });
});
//renders the home page aftern getting specific URL
router.get('/login/:rollnumber',function(req,res,next){
  res.render("welcomestudentpage",{
    viewTitle:"Welcome page(home page)",
    outputrollnumber:req.params.rollnumber
  });
});
//if user choose 'update profile link'
router.get('/updateProfile/:rollnumber',function(req,res,next){
  var studentobject=new studentPersonalDetails();
  studentPersonalDetails.findOne({'sroll':req.params.rollnumber},(err,doc)=>{
    if(!err)
    {
      console.log(doc);
      //console.log(doc.saddress);
      console.log("The first element of array:-"+doc.saddress[0].area);
      var saddressobject=new saddress();

      res.render("updateprofile",{
        viewTitle:"Update Profile",

        outputrollnumber:req.params.rollnumber,
        studentobject:doc,
        addressobject: doc.saddress[0]
      });
    }
    else{
      console.log("Error in retrieving data of student");
    }
  });
});
//if the submit is posted from updateprofile page
//writing the post method for that
router.post('/updatedform/:rollnumber',function(req,res,next){


  /*studentobject.sroll=req.params.rollnumber;
  studentobject.sname=req.body.;
  studentobject.semail=req.body.;
  studentobject.sbatch*/
  studentPersonalDetails.findOneAndUpdate({'sroll':req.params.rollnumber},req.body,{new: true},(err,doc)=>{
    if(!err)
    {
      //console.log(doc.saddress.area);
      //studentPersonalDetails.findOneAndUpdate({'sroll:req.params.rollnumber'});
        var studentobject1=new studentPersonalDetails(req.body.studentobject1);
        studentobject1.save(function(){
        studentobject1.saddress.push();
      });
      console.log("updation successfull!!");
      //redorect him back to home page
      res.redirect('/login/'+req.params.rollnumber);
    }
    else{
      console.log("some problem!!!");
      if(err.name=='ValidationError')
      {
        handleValidationError(err,req.body);
        res.render("student/addOrEdit",{
          viewTitle: "Update Student Record",
          studentobject: req.body,


        });
      }else {
        {
          console.log("Error during record update: " + err);
        }
      }
    }
  });
});
//when the link of 'my profile' is clicked
router.get('/myprofile/:rollnumber',function(req,res,next){

  var saddressobject=new saddress();
    studentPersonalDetails.findOne({'sroll':req.params.rollnumber},(err,docs)=>{
      if(!err)
      {
        console.log('in the my profile form:-'+docs.saddress[0]);
        res.render("myprofile",{
          viewTitle: 'Student Profile',
          studentobject: docs,
          outputrollnumber:req.params.rollnumber,
          saddressobject: docs.saddress[0]
        });

      }else {
        {
          console.log('error in retrieving data');
        }
      }
    });
  });
  //when the link to view teacher profile is clicked
  router.get('/myProfiletr/:tid',function(req,res,next){
    var teacherobject=new teacherDetails;

    teacherDetails.findOne({'tid':req.params.tid},(err,doc)=>{
      if(!err)
      {
        //console.log(doc.tbatch[0]);
        res.render("teacherprofilepage",{
          viewTitle: "Teacher Profile",
          teacherobject: doc,
          outputid: req.params.tid,
          list: doc.tbatch
        });
      }
      else {
        console.log("Error in retrieving the details of teacher");
      }
    });


  });

router.get('/updateProfiletr/:tid',function(req,res,next){
  teacherobject=new teacherDetails;
  teacherDetails.findOne({'tid':req.params.tid},(err,doc)=>{
    if(!err)
    {
      res.render("updateteacher",{
        teacherobject: doc,
        outputid: req.params.tid,
        viewTitle: "Update Profile",
        list: doc.tbatch
      });
    }
  });
});
  //when the tacer update has to be done
router.post('/updatetrdetails/:tid',function(req,res,next){

  teacherDetails.findOneAndUpdate({'tid':req.params.tid},req.body,{new: true},(err,doc)=>{
    if(!err)
    {

        /*var studentobject1=new studentPersonalDetails(req.body.studentobject1);
        studentobject1.save(function(){
        studentobject1.saddress.push();
      });*/
      console.log("updation successfull!!");

      res.redirect('/trlogin/'+req.params.tid);
    }
    else{
      console.log("some problem!!!");
      if(err.name=='ValidationError')
      {
        handleValidationError(err,req.body);
        res.render("student/addOrEdit",{
          viewTitle: "Update Student Record",
          studentobject: req.body,


        });
      }else {
        {
          console.log("Error during Teacher Profile Update: " + err);
        }
      }
    }
  });

});
//when link to add new meeting details is clicked
router.get('/newmeet/:tid',function(req,res,next){

  res.render("meetform",{
    viewTitle: "Fill meeting details",
    outputid:req.params.tid
  });
});
//when the form is posted with new meetings details to add
router.post('/detailsfilled/:tid',function(req,res,next){
  var meetingsobject=new meetings();
  meetingsobject.mdate=req.body.mdate;
  meetingsobject.mbatch=req.body.mbatch;
  meetingsobject.mremarks=req.body.mremarks;
  meetingsobject.machieve=req.body.machieve;

  meetingsobject.save((err,docs)=>{
    if(!err)
    {
      //res.redirect('studentdetails/list');
      console.log("successful insertion");
      res.redirect("/trlogin/"+req.params.tid);

    }else{
      //else
      console.log('Error during record insertion:'+err);
    }

  });
  console.log(req.body.mdate);
  console.log(req.body.mbatch);
  console.log(req.body.mremarks);
  console.log(req.body.machieve);

});
//when the view option of meetings details is selected
router.get('/meetdetails/:tid',function(req,res,next){
  var list=new meetings();
  meetings.find({},(err,docs)=>{
    if(!err)
    {
      res.render("meetdetails",{
        viewTitle:'Meeting Record',
        list: docs,
        outputid: req.params.tid

      });
    }
    else {
      {
        console.log('Error in retrieving data of meet');
      }
    }
  });

});
router.get('/meetid/:mdate',function(req,res,next){
  console.log('in edit functn '+globaltid);
  var meetingsobject=new meetings();

  meetings.findOne({'mdate':req.params.mdate},(err,doc)=>{
    if(!err)
    {
      console.log('found record'+doc);
      res.render("updatemeetdetails",{
        viewTitle:"Update Meeting details",

        outputid:globaltid,
        meetingsobject:doc,
        meetingdate: req.params.mdate
      });
    }
    else{
      console.log("Error in retrieving data of student");
    }
  });
});
router.post('/meetupdated/:mdate',function(req,res,next){
  meetings.findOneAndUpdate({'mdate':req.params.mdate},req.body,{new: true},(err,doc)=>{
    if(!err)
    {
      res.redirect('/trlogin/'+globaltid);
    }
    else{
      if(err.name=='ValidationError')
      {
        handleValidationError(err,req.body);
        res.render("student/addOrEdit",{
          viewTitle: "Update Student Record",
          studentobject: req.body

        });
      }else {
        {
          console.log("Error during  meeting record update: " + err);
        }
      }
    }

  });
});
//deleting the meeting details
router.get('/meetdelete/:id',function(req,res,next){
  meetings.findByIdAndRemove({'_id':req.params.id},(err,docs)=>{
    if(!err)
    {
      res.redirect('/trlogin/'+ globaltid);
      console.log('Delection successful!!');
    }
    else {
      {
        console.log('Error in deletion!');
      }
    }

  });
});
router.get('/logout/',function(req,res,next){
  req.session.success=false;
  req.session.errors=null;
  res.render("common",{viewTitle:"Select User"});
});


















router.get('/showmyform/:rollnumber',function(req,res,next)
{
  var studentobject= new studentPersonalDetails();
  studentPersonalDetails.findOne({'sroll':req.params.rollnumber},(err,doc)=>{
    if(!err)
    {
      res.render("myitems",{
        viewTitle:"Update Student Record",
        studentobject: doc
      });
    }
  });
});
router.get('/fillmyform/:rollnumber',function(req,res,next)
{
  res.render("fillmyform",{
    viewTitle:"Fill Form"
  });
});


















router.post('/getstudentdetails',function(req,res,next)
{
  var studentobject= new studentPersonalDetails();
  studentobject.sroll=req.body.sroll;
  studentobject.sname=req.body.sname;
  studentobject.semail=req.body.semail;
  studentobject.save((err,doc)=>{
    if(!err)
    {
      //res.redirect('studentdetails/list');
      console.log("successful insertion");

    }else{
      //else
      console.log('Error during record insertion:'+err);
    }
  });

});

router.get('/addOrEdit',(req,res)=>{
  //res.json('sample text');
  res.render("student/addOrEdit",{
    viewTitle:"Insert"
  });
});
//function to update student Record in mongoDB
//in new:true if the value would have been false,then the new data would not have came
//into the req.body
function updateRecordStudent(req,res){
  studentPersonalDetails.findOneAndUpdate({_id:req.body._id},req.body,{new: true},(err,doc)=>{
    if(!err)
    {
      res.redirect('studentdetails/list');
    }
    else{
      if(err.name=='ValidationError')
      {
        handleValidationError(err,req.body);
        res.render("student/addOrEdit",{
          viewTitle: "Update Student Record",
          studentobject: req.body

        });
      }else {
        {
          console.log("Error during record update: " + err);
        }
      }
    }

  });

}
//function to insert record in mongoDB
function insertRecordStudent(req,res){
  var studentobject= new studentPersonalDetails();
  studentobject.sroll=req.body.sroll;
  studentobject.sname=req.body.sname;
  studentobject.semail=req.body.semail;
  studentobject.save((err,doc)=>{
    if(!err)
    {
      res.redirect('studentdetails/list');

    }else{
      //else
      console.log('Error during record insertion:'+err);
    }
  });

}
//creating route for the new page /studentdetails/list
router.get('/list',(req,res)=>{
  //res.json('from list');
  studentPersonalDetails.find({},(err,docs)=>{
    if(!err){
      res.render("student/list",{
        list: docs
      });
    }
    else{
      console.log('Error in Retrieving student list'+err);
    }
  });

});
router.post('/',(req,res)=>{

  //console.log(req.body);
  //calling the defined function from this function
  if(req.body._id=='')
  //tells us that insert operation needs to be performed
    insertRecordStudent(req,res);
    else {
      //else updates the record
      updateRecordStudent(req,res);
    }

});
function handleValidationError(err,body)
{
  for(field in err.errors)
  {
    switch(err.errors[field].path()){
      case 'sroll':
              body['emptyRollNumber']=err.errors[field].message;
              break;
      case 'semail':
              body['emailError']=err.errors[field].message;
              break;
      default:
            break;
    }
  }
}
router.get('/:id',(req,res)=>{
  studentPersonalDetails.findById(req.params.id,(err,doc)=>{
    if(!err)
    {
      res.render("student/addOrEdit",{
        viewTitle:"Update Student Record",
        studentobject: doc
      });
    }
  });

});
//route to delete an Record
router.get('/delete/:id',(req,res)=>{
  studentPersonalDetails.findByIdAndRemove(req.params.id,(err,doc)=>{
    if(!err)
    {
      res.render("student/list");
    }
    else {
      {
        console.log("Error in deleting the record:" + err);
      }
    }
  });

});
//now we need to export this router object from controller
module.exports=router;
