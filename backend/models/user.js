const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email:String,
    password:{type:String,required:true},
    currentCharacter:String
});

userSchema.plugin(uniqueValidator);

module.exports=mongoose.model('User', userSchema); //collections name=> users