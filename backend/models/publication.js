const mongoose=require('mongoose');

const publicationSchema = mongoose.Schema({
    userId:String,
    dateOfPublish:Date,
    reviewed:Boolean,
    popularity:Number,
    language:Object,
    level:Number,
    title:String,
    text:String
})

module.exports=mongoose.model("Publication",publicationSchema);
