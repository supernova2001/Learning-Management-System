/*database password : FQoxbDavwW5C5tAm*/
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const body = require('body-parser');
const PORT = process.env.PORT || 8080;
const path  = require('path');
const crypto = require('crypto');
var urlencodedParser=body.urlencoded({ extended: false });
const session = require('express-session');
const flash = require('connect-flash');
const { urlencoded } = require('body-parser');
const passport = require('passport');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

app.use(body.json());
app.use(methodOverride('_method'));
app.set('view engine','ejs');
const routing = require('./routes');
const { checkUser } = require('./middleware/authMiddleware');

app.use(cookieParser());
app.get('/set-cookie',(req,res)=>{
    res.cookie('newEmployee',true,{maxAge: 1000 * 600, httpOnly: true});
    res.cookie('newUser',false);
   // res.setHeader('Set-Cookie','newUser=true');
    res.send('you got the cookies');
});
app.get('/read-cookie',(req,res)=>{
    const cookies = req.cookies;
    console.log(cookies);
    res.json(cookies);
});
//storage 
const storage = multer.diskStorage({
  destination:function(req,file,callback){
    callback(null,'./public/uploads');
  },
  filename: function(req,file,callback){
    callback(null,Date.now() + file.originalname);
  }
});
//upload parameters for Multer
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024*1024*7
  }
});
app.use( express.static( "public" ) );
app.get('/',routing);
app.get('/adduser',routing);
app.post('/adduser',urlencodedParser,routing);
app.post('/',urlencodedParser,routing);
app.get('/dashboard',routing);
app.get('/logout',routing);
app.get('/addcourses',routing);
app.post('/addcourses',urlencodedParser, routing);
app.get('/assigncourses',routing);
app.post('/assigncourses',urlencodedParser, routing);
app.get('/facultydashboard',routing);
app.get('/facultypage',routing);
app.get('/:name',routing);
app.get('/compiler',routing);
app.get('/calculator',routing);
app.get('/subjectpage',routing);
app.get('/uploadfile',routing);
app.post('/uploadfile',upload.single('upload'),urlencodedParser,routing);
app.get('/:id/:upload/:subject',routing);
app.post('/:id/:upload/:subject',upload.single('asssubmission'),urlencodedParser,routing);
app.get('/:id/submissions',routing);
app.listen(PORT,(err)=>{
    if(!err){
        console.log('Server Started');
    }
    else{
        console.log(err);
    }
});
mongoose.connect('mongodb+srv://useradmin:FQoxbDavwW5C5tAm@cluster0.uxcgk.mongodb.net/miniproject?retryWrites=true&w=majority', (err)=>{
    if(!err){
        console.log('Connection made successfully');
    }
    else{
        console.log(err);
    }
});
