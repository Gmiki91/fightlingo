const express = require('express');
const router = express.Router();
const Master = require("../models/master");

router.get('/:level',(req,res,next)=>{
    Master.find({
        level:req.params.level
    })
    .then((masters)=>{
        return res.json(masters);
    })
})

module.exports =router;