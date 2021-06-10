const mongoose=require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const progressSchema = mongoose.Schema({
    sentenceId:ObjectId,
    characterId:ObjectId,
    learned:Boolean,
    learningProgress:Number,
    consecutiveCorrectAnswers:Number,
    interval:Number,
    difficulty:Number,
    nextReviewDate:Date
})

module.exports=mongoose.model("Progress",progressSchema);