const mongoose=require('mongoose');

const lessonSchema = mongoose.Schema({
    _id:String,
    masterId:String,
    name:String,
    rank:Number,
    language:Object,
    level:Number
})

module.exports=mongoose.model("Lesson",lessonSchema);