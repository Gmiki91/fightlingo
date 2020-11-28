const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email:String,
    password:{type:String,required:true},
    name:{type:String,required:true,uniqe:true},
    pic:String,
    language:Object,
    level:Number,
    rank:Number,
    str:Number,
    health:Number,
    money:Number,
    fame:[Number,Number],
    items:[Object],
});

userSchema.plugin(uniqueValidator);

module.exports=mongoose.model('User', userSchema); //collections name=> users