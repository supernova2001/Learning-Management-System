const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Student = mongoose.model('student');
const Courses = mongoose.model('courseslist');
const requireAuth = (req,res,next)=>{   
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'secret key',(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/');
            }
            else{
                next();
            }
        });
    }
    else{
        res.redirect('/');
    }

}

const checkUser = (req,res,next) =>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'secret key',async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else{
                let user = await Student.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }
    else{
        res.locals.user = null;
    }
}

module.exports = { requireAuth, checkUser }