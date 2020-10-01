const mongoose=require('mongoose');

const sentenceSchema = mongoose.Schema({
    english: String,
    translations:[String],
    level: Number,
    lesson: Object,
    learned: Boolean,
    learningProgress:Number,

    consecutiveCorrectAnswers: Number,
    interval:Number,
    difficulty:Number,
    nextReviewDate:Date,
});

module.exports=mongoose.model('Sentence', sentenceSchema);