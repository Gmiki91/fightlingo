const mongoose=require('mongoose');

const publicationSchema = mongoose.Schema({
    characterId:String,
    dateOfPublish:Date,
    dateOfLastLecture:Date,
    reviewed:Boolean,
    popularity:Number,
    language:Object,
    level:Number,
    title:String,
    text:String,
    author:String,
    numberOfQuestions:Number
})

module.exports=mongoose.model("Publication",publicationSchema);
