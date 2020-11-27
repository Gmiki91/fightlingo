const express = require('express');
const router = express.Router();
const Progress= require("../models/progress");
const ObjectId = require('mongoose').Types.ObjectId;

router.post('/:sentenceId',(req,res,next)=>{
    Progress.findOne({sentenceId:ObjectId(req.params.sentenceId), userId:ObjectId(req.body._id)})
    .then(progress => {
        res.status(200).json(progress);})
});

module.exports= router;