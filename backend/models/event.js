const mongoose=require('mongoose');

const eventSchema = mongoose.Schema({
    _id:String,
    name:String,
    group:Number,
    place:Object,
    from:Object,
})

module.exports=mongoose.model("Event",eventSchema);