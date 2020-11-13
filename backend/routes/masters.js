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
    console.log("helló");
    Master.findOne({
        rank:req.params.rank
    })
    .then((master)=>{
        console.log(master);
        return res.json(master);
    })
})

module.exports =router;