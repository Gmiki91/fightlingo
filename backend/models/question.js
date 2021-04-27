const mongoose=require('mongoose');

const questionSchema = mongoose.Schema({
    publicationId:String,
    popularity:Number,
    votedBy:[String],
    question:String,
    answers:[String],
    userId:String

})

module.exports=mongoose.model("Question",questionSchema);
