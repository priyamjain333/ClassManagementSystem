var express= require('express');

var app=express();


app.get('/teacherpage',function(res,req){
    res.send('This is Teacher Page');
});

app.get('/studentpage',function(res,req){
    res.send('This is Student Page');
});

app.get('/',function(res,req){
    res.send('This is Home Page');
});


app.listen(3000,function(){
  console.log('Our server is live on port 3000');
});
