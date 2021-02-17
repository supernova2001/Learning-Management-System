const mongoose = require('mongoose');

const Studentssubmission = new mongoose.Schema({
    title:{
        type: String
    },
    batchid:{
        type: String
    },
    subjectid:{
        type:String
    },
    file:{
        type: String
    },
    
});
mongoose.model('submissionsof',Studentssubmission);