const mongoose=require('mongoose');

const lessonSchema = mongoose.Schema({
    _id:String,
    name:String,
    rank:Number,
    language:Object,
    level:Number,
    overView:String
})

module.exports=mongoose.model("Lesson",lessonSchema);