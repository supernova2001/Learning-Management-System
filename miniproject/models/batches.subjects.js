const mongoose = require('mongoose');

const Coursesschema = new mongoose.Schema({
    batchid:{
        type: String,
        required: [true,'please Enter the Id'],
    },
    coursename:{
        type: String
    },
    courseid:{
        type: String
    }
});

mongoose.model('courseslist',Coursesschema);