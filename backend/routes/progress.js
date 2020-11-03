const express = require('express');
const router = express.Router();
const Progress= require("../models/progress");
const ObjectId = require('mongoose').Types.ObjectId;

router.post('/:sentenceId',(req,res,next)=>{
    let sentenceId=new ObjectId(req.params.sentenceId);
    let userId=new ObjectId(req.body._id);
    Progress.findOne({sentenceId:sentenceId, userId:userId})
    .then(progress => {
        res.status(200).json(progress);})
});

module.exports= router;