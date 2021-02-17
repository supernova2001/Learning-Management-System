const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Studentschema = new mongoose.Schema({
    name:{
        type: String
    },
    userid:{
        type: String,
        required: [true,'please enter your Id'],
        unique: true
    },
    password:{
        type: String
    },
    role:{
        type: String
    }
});
Studentschema.post('save',function(doc,next){
    console.log('New User Created',doc);
    next();
});
Studentschema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});
Studentschema.statics.login = async function(userid,password){
    const user = await this.findOne({ userid });
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Id');

}
mongoose.model('student',Studentschema);