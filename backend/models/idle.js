const mongoose=require('mongoose');

const idleSchema = mongoose.Schema({
    place:Object,
    level:Number,
    text:[String],
    //animation: ???
})

module.exports=mongoose.model("Idle",idleSchema);