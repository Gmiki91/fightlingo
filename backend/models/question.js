const mongoose=require('mongoose');

const questionSchema = mongoose.Schema({
    publicationId:String,
    popularity:Number,
    question:String,
    answers:[String],

})

module.exports=mongoose.model("Question",questionSchema);
