const express = require('express');
const router = express.Router();
const Progress= require("../models/progress");
const ObjectId = require('mongoose').Types.ObjectId;
const authCheck = require('../middleware/auth-check');

router.get('/:sentenceId',authCheck,(req,res,next)=>{
    Progress.findOne({sentenceId:ObjectId(req.params.sentenceId), characterId:ObjectId(req.userData.characterId)})
    .then(progress => {
        res.status(200).json(progress);})
});

router.delete('/:charId', authCheck, (req,res,next)=>{
    Progress.deleteMany({characterId:ObjectId(req.params.charId)}).then(()=>{
        return res.status(200).json("Progress deleted");
    })
})

module.exports= router;