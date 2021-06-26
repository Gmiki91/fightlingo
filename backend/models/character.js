const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const characterSchema = mongoose.Schema({
    userId:String,
    name:String,
    pic:String,
    language:Object,
    level:Number,
    rank:Number,
    money:Number,
    strength:Number,
    hitpoint:Number,
    equippedStaff:String,
    equippedRobe:String,
    items:[Object],
    brokens:[String],
    confirmed:Boolean,
    isReadyForExam:Boolean,
    hasShipTicket:Boolean,
    lastLoggedIn:Date,
    scrollFinished:Date,
    lastLecture:Date
});

characterSchema.plugin(uniqueValidator);

module.exports=mongoose.model('Character', characterSchema); 