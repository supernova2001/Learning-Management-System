require('./models/Student.model');
require('./models/batches.subjects');
require('./models/Faculty.model');
require('./models/announcements');
require('./models/student.submissions');
const mongoose = require('mongoose');
const Student = mongoose.model('student');
const Courses = mongoose.model('courseslist');
const Assigncourses = mongoose.model('facultymodel');
const Announcements = mongoose.model('announcements');
const Studentssubmission = mongoose.model('submissionsof');
const express = require('express');
const router = express.Router();
const session = require('express-session');
const flash = require('connect-flash');
const { urlencoded } = require('body-parser');
const passport = require('passport');
const body = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {requireAuth, checkUser} = require('./middleware/authMiddleware');
var ses;
var id;
var name;
var title;
const handleErrors = (err)=>{
    console.log(err.message,err.code);
    let error = {userid: ''}
    //duplicate id
    if(err.message==='Incorrect Id'){
        error.userid = 'Invalid Id';
    }
    if(err.message==='Incorrect Password'){
        error.password = 'Invalid Password';
    }
    if(err.code=== 11000){
        error.email = 'Use another Id';
    }
    if(err.message.includes('student validation failed')){
        Object.values(err.errors).forEach(({ properties })=>{
            error[properties.path] = properties.message;
        })
    }
    return error;

}
const maxage = 3 * 24 * 60 * 60;
const createToken = (id) =>{
    return jwt.sign({ id }, 'secret key',{
        expiresIn: maxage
    });
}
router.get('/adduser',function(req,res){
    res.render('adminpanel');
});
router.post('/adduser',async(req,res)=>{
    var {name,userid,password,role} = req.body;
    try{
        const user = await Student.create({name,userid,password,role});
        const token = createToken(user._id);
        res.cookie('jwt', token, {maxAge: maxage * 1000,httpOnly: true});
        res.status(201).json({user: user._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});
router.get('/',function(req,res){
    res.render('login');
});
router.post('/',async function(req,res){
   const { userid,password } = req.body;
   try{
        const user = await Student.login(userid,password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {maxAge: maxage * 1000,httpOnly: true});
        res.status(201).json({user: user._id});
        
   }
   catch(err){
    const errors = handleErrors(err);
       res.status(400).json({ errors });
   }
});
router.get('/logout',(req,res)=>{
    res.cookie('jwt', '',{maxAge: 1});
    res.redirect('/');
});

router.get('/dashboard',requireAuth,checkUser, (req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'secret key',async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
            }
            else{
                let user = await Student.findById(decodedToken.id);
                var x = user.userid;
                var role = user.role;
                var id = x.substring(5,9);
                var courses = await Courses.find({'batchid': id});
                var facultybatch = await Assigncourses.find({'facultyid': x});
                res.render('dashboard',{'courses': courses,'role': role,'batch': facultybatch});
            }
        });
    }
});
router.get('/facultydashboard',(req,res)=>{
    res.render('facultypage',{'id': id});
});
router.get('/facultypage',(req,res)=>{
    res.render('facultydashboard');
});
router.get('/logout',(req,res)=>{
    res.redirect('/');
    res = null;
});
router.get('/addcourses',(req,res)=>{
    res.render('addcourses');
});
router.post('/addsubmission',async(req,res)=>{

});
router.post('/addcourses',async (req,res)=>{
    const { batchid,courseid,coursename } = req.body;
    var courses = await new Courses;
        courses.batchid = batchid;
        courses.courseid = courseid;
        courses.coursename = coursename;
        courses.save();
});
router.get('/assigncourses',(req,res)=>{
    res.render('assigncourses');
});
router.get('/compiler',(req,res)=>{
    res.render('compiler');
});
router.get('/calculator',(req,res)=>{
    res.render('calculator');
});
router.get('/subjectpage',(req,res)=>{
    res.render('subjectpage');
});
router.get('/uploadfile',(req,res)=>{
    res.render('upload');
});
router.get('/:id/submissions', async (req,res)=>{
    var id = req.params.id;
    console.log(id);
    let finding = await Studentssubmission.find({'title': id});
    console.log(finding);
    res.render('studentslist',{'list': finding});
            
}); 
router.post('/:id/:upload/:subject',(req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'secret key',async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
            }
            else{
                let user = await Student.findById(decodedToken.id);
                var x = user.userid;
            }
        });
    }
    const studentsupload = new Studentssubmission;
    studentsupload.title = req.params.id;
    studentsupload.batchid = req.params.upload;
    studentsupload.subjectid = req.params.subject;
    studentsupload.file = req.file.filename;
    studentsupload.save();
    res.redirect('back');

});
router.get('/:id',async (req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'secret key',async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
            }
            else{
                let user = await Student.findById(decodedToken.id);
                var x = user.userid;
                var role = user.role;
                var urlid = req.params.id;
                console.log(req.params.id);
                let find = await Announcements.find({'subjectid': urlid});
                var match = false;
                 res.render('common',{'urlid':urlid,'role': role,'files': find, subjectid: req.params.id});

            }
        });
    }
});
router.post('/uploadfile',(req,res)=>{
    const {subjectid,batchid,title,description} = req.body;
    const testing = new Announcements;
    testing.subjectid = subjectid;
    testing.batchid = batchid;
    testing.title = title;
    testing.description = description;
    testing.file = req.file.filename;
    testing.save();
    res.render('upload');

});
router.post('/assigncourses',async (req,res)=>{
    const { facultyname,facultyid,batchid,subject1,subject2 } = req.body;
    var subjects = await new Assigncourses;
    subjects.facultyname = facultyname;
    subjects.facultyid = facultyid;
    subjects.batchid = batchid;
    subjects.subject1 = subject1;
    subjects.subject2 = subject2;
    subjects.save();
});

module.exports = router;