const mongoose=require('mongoose');

const itemSchema = mongoose.Schema({
    _id:String,
    pic:String,
    price:Number,
    name:String,
    level:Number,
    capacity:Number,
    pwr:Number,
    Style:String,
    Rarity:String
})

module.exports=mongoose.model("Item",itemSchema);