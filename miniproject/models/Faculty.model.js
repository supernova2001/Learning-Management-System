const mongoose = require('mongoose');

const Facultyschema = new mongoose.Schema({
    facultyname:{
        type: String
    },
    facultyid:{
        type: String
    },
    batchid:{
        type:String
    },
    subject1:{
        type: String
    },
    subject2:{
        type: String
    },
});
mongoose.model('facultymodel',Facultyschema);