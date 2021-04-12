const mongoose=require('mongoose');

const questionSchema = mongoose.Schema({
    _id:String,
    publicationId:String,
    popularity:Number,
    answers:[String],

})

module.exports=mongoose.model("Question",questionSchema);
