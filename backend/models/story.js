const mongoose=require('mongoose');

const storySchema = mongoose.Schema({
    lessonId:String,
    title:String,
    content:String,
    questions:[String],
    answers:[[String]]
})

module.exports=mongoose.model("Story",storySchema);