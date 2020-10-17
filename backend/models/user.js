const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    name:{type:String,required:true,uniqe:true},
    password:{type:String,required:true},
    monster:String,
    level:Number,
    language:Object,
    sentences:[Object]
});

userSchema.plugin(uniqueValidator);

module.exports=mongoose.model('User', userSchema);