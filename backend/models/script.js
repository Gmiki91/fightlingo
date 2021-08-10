const mongoose=require('mongoose');

const scriptSchema = mongoose.Schema({
    eventId:String,
    language:String,
    eventText:String,
    startText:String,
    positive:[String],
    negative:[String],
    ending:[String]
})

module.exports=mongoose.model("Script",scriptSchema);