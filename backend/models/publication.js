const mongoose=require('mongoose');

const publicationSchema = mongoose.Schema({
    _id:String,
    userId:String,
    dateOfPublish:Date,
    reviewed:Boolean,
    defended:Boolean,
    popularity:Number,
    language:Object,
    level:Number,
    title:String,
    text:String
})

module.exports=mongoose.model("Publication",publicationSchema);
