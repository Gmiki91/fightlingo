const mongoose=require('mongoose');

const masterSchema = mongoose.Schema({
    _id:String,
    name:String,
    pic:String,
    rank:Number,
    level:Number,
    str:Number,
    dex:Number,
    health:Number,
    gm:Boolean,
    language:Object,
    gift_id:String
})

module.exports=mongoose.model("Master",masterSchema);
