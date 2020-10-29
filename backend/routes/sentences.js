const express = require('express');
const router = express.Router();
const User = require("../models/user")
const ObjectId = require('mongoose').Types.ObjectId;

router.get("/overdue/:username",(req,res,next)=>{
    User.find({
          name:req.params.username,
          "sentences.nextReviewDate":{$lte:new Date()}
      })
      .then(documents=>{
          res.status(200).json(documents);
      })
   });
  
router.get("/:username",(req,res,next)=>{
      User.find({
          name:req.params.username,
      })
      .then(documents=>{
          res.status(200).json(documents);
      })
   });
  
router.patch("/", (req,res,next)=>{
  
       var objId=new ObjectId(req.body[1]._id);
  
       User.updateOne({_id:req.body[0]._id, "sentences._id":objId},
       {
           "sentences.$.learningProgress":req.body[1].learningProgress,
           "sentences.$.learned":req.body[1].learned,
           "sentences.$.consecutiveCorrectAnswers":req.body[1].consecutiveCorrectAnswers,
           "sentences.$.consecutiveCorrectAnswers":req.body[1].consecutiveCorrectAnswers,
           "sentences.$.interval":req.body[1].interval,
           "sentences.$.difficulty":req.body[1].difficulty,
           "sentences.$.nextReviewDate":req.body[1].nextReviewDate
      },() =>console.log("sentence updated"));
   });

module.exports= router;