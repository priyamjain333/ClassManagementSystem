require('./models/db.js');

//we start the epress server
const express=require('express');
//request controller for studentController
const studentController=require('./controllers/studentControllers');

const path=require('path');
const exphbs=require('express-handlebars');
const bodyparser=require('body-parser');
const expressvalidator=require('express-validator');
var expressSession=require('express-session');
var app =express();

//as second parameter we pass the folder name where we save views for the application
//inside view we have handle bar view files
app.set('views',path.join(__dirname,'/views/'));
//configuring express engine for handle bars
app.use(express.static(__dirname + '/public'));
app.engine('hbs',exphbs({extname:'hbs',defaultLayout:'mainLayout',layoutsDir:__dirname+'/views/layouts/'}));
app.set('view engine','hbs');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended:true
}));
app.use(expressvalidator());
app.use(expressSession({secret:'max',saveUninitialized: false,resave:false}));
//to actually start the server
app.listen(3000,()=>{
  console.log('Express Server started at port: 3000');
});

//adding route for studentController
app.use('/',studentController);