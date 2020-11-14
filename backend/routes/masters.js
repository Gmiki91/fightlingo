const express = require('express');
const router = express.Router();
const Master = require("../models/master");

router.get('/level/:level',(req,res,next)=>{
    Master.find({
        level:req.params.level
    })
    .then((masters)=>{
        return res.json(masters);
    })
})

router.get('/rank/:rank',(req,res,next)=>{
    let rank = Number(req.params.rank)+1;
    console.log("ranks "+rank);
    Master.findOne({
        rank:rank
    })
    .then((master)=>{
        console.log(master);
        return res.json(master);
    })
})

module.exports =router;