/*database password : FQoxbDavwW5C5tAm*/
const express = require('express');
const app = express();
const cors = require('cors');
const parser = require('body-parser');
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://useradmin:FQoxbDavwW5C5tAm@cluster0.uxcgk.mongodb.net/myfirstdatabase?retryWrites=true&w=majority',(err)=>{
    if(!err){
        console.log('Connection Made');
    }
    else{
        console.log(err);
    }
});
app.use(cors());

app.listen(PORT,(err)=>{
    if(!err){
        console.log(`Server started ${PORT}`);
    }
    else{
        console.log(err);
    }
});


