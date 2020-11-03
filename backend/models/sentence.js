const mongoose=require('mongoose');

const sentenceSchema = mongoose.Schema({
    english: String,
    translations: [String],
    lessonId: String,
});

var russianSentence = mongoose.model('russian_sentence', sentenceSchema);
var frenchSentence = mongoose.model('french_sentence', sentenceSchema);
var serbianSentence = mongoose.model('serbian_sentence', sentenceSchema);
module.exports = {
    russian : russianSentence,
    french : frenchSentence,
    serbian: serbianSentence
} 

