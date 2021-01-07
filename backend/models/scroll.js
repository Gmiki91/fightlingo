const mongoose=require('mongoose');

const scrollSchema = mongoose.Schema({
    _id:String,
    title:String,
    content:String,
    translation:String,
    questions:[String],
    answers:[[String]],
    storyNumber:Number,
    language:Object,
    level:Number,
})

module.exports=mongoose.model("Scroll",scrollSchema);