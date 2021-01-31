const mongoose=require('mongoose');

const scrollSchema = mongoose.Schema({
    _id:String,
    title:String,
    number:Number,
    language:Object,
    grammar:String,
    level:Number
})

module.exports=mongoose.model("Scroll",scrollSchema);