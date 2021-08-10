const express = require('express');
const authCheck = require('../middleware/auth-check');
const router = express.Router();
const Event = require("../models/event");
const Script = require("../models/script");

const allEvents = [
    "e0101", "e0201", "e0301", "e0401", "e0501", "e0601", "e0701", "e0801", "e0901", "e1001", "e1101",
    "e0102", "e0202", "e0302", "e0402", "e0502", "e0602", "e0702", "e0802", "e0902", "e1002", "e1102",
    "e0103", "e0203", "e0303", "e0403", "e0503", "e0603", "e0703", "e0803", "e0903", "e1003", "e1103",
    "e0104", "e0204", "e0304", "e0404", "e0504", "e0604", "e0704", "e0804", "e0904", "e1004", "e1104",
    "e0105", "e0205", "e0305", "e0405", "e0505", "e0605", "e0705", "e0805", "e0905", "e1005", "e1105",
    "e0106", "e0206", "e0306", "e0406", "e0506", "e0606", "e0706", "e0806", "e0906", "e1006", "e1106",
    "e0107", "e0207", "e0307", "e0407", "e0507", "e0607", "e0707", "e0807", "e0907", "e1007", "e1107",
];

const level1Events = [
    "e0101", "e0201", "e0301", "e0401", "e0501", "e0601", "e0701", "e0801", "e0901", "e1001", "e1101"
];
const level2Events = [
    "e0102", "e0202", "e0302", "e0402", "e0502", "e0602", "e0702", "e0802", "e0902", "e1002", "e1102",
    "e0201", "e0301", "e0401", "e0501", "e0601", "e0701", "e0801", "e1001"
];
const level3Events = [
    "e0103", "e0203", "e0303", "e0403", "e0503", "e0603", "e0703", "e0803", "e0903", "e1003", "e1103",
    "e0202", "e0402", "e0602", "e0702", "e0802", "e0902", "e1002"
];
const level4Events = [
    "e0104", "e0204", "e0304", "e0404", "e0504", "e0604", "e0704", "e0804", "e0904", "e1004", "e1104",
    "e0303", "e0403", "e0603", "e0703", "e0803", "e1003",
];
const level5Events = [
    "e0105", "e0205", "e0305", "e0405", "e0505", "e0605", "e0705", "e0805", "e0905", "e1005", "e1105",
    "e0204", "e0304", "e0404", "e0604", "e0704", "e0804", "e0904", "e1004",
    "e0303", "e0403", "e0603", "e0703", "e0803",
];
const level6Events = [
    "e0106", "e0206", "e0306", "e0406", "e0506", "e0606", "e0706", "e0806", "e0906", "e1006", "e1106",
    "e0205", "e0305", "e0405", "e0605", "e0705", "e0805", "e0905", "e1005",
    "e0204", "e0304", "e0404", "e0604", "e0704", "e0804", "e0904", "e1004",
    "e0303", "e0403", "e0603", "e0703", "e0803",
];
const level7Events = [
    "e0107", "e0207", "e0307", "e0407", "e0507", "e0607", "e0707", "e0807", "e0907", "e1007", "e1107",
    "e0206", "e0306", "e0406", "e0606", "e0706", "e0806", "e0906", "e1006",
    "e0205", "e0305", "e0405", "e0605", "e0705", "e0805", "e0905", "e1005",
    "e0204", "e0304", "e0404", "e0604", "e0704", "e0804", "e0904", "e1004",
    "e0303", "e0403", "e0603", "e0703", "e0803",
];

router.get('/',authCheck,(req,res,next)=>{
    const level = req.userData.level;
    let ids=[];
    switch (level) {
        case 1: ids= level1Events;
        break;
        case 2: ids= level2Events;
        break;
        case 3: ids= level3Events;
        break;
        case 4: ids= level4Events;
        break;
        case 5: ids= level5Events;
        break;
        case 6: ids= level6Events;
        break;
        case 7: ids= level7Events;
        break;
    };
    Event.find({_id: { $in: ids } }).then(result=> {
        return res.send(result);
    }
    );
})

router.get('/script/:eventId',authCheck,(req,res,next)=>{
    Script.findOne({
        eventId:req.params.eventId,
        language:req.userData.language
    }).then(script=>{
        res.send(script)});
})

module.exports=router;