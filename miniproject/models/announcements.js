const mongoose = require('mongoose');
const Announcements = new mongoose.Schema({
    subjectid:{
        type: String
    },
    batchid:{
        type: String
    },
    title:{
        type: String
    },
    description:{
        type: String
    },
    file:{
        type: String
    }
});

mongoose.model('announcements',Announcements);