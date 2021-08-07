const express = require('express');
const authCheck = require('../middleware/auth-check');
const router = express.Router();
const Event = require("../models/event");
const allEvents = ["e0101", "e0102", "e0103", "e0104", "e0105", "e0202", "e0203", "e0204", "e0205"];
const level1Events = ["e0101", "e0102", "e0103", "e0104", "e0105"];
const level2Events = ["e0101", "e0102", "e0103", "e0104", "e0105", "e0202", "e0203", "e0204", "e0205"];

router.get('',authCheck,(req,res,next)=>{
    const level = req.userData.level;
    switch (level) {
        case 1: ids= level1Events;
        break;
        case 2: ids= level2Events;
        break;
    }
    Event.find({_id: { $in: ids } }).then(result=>console.log(result));
})