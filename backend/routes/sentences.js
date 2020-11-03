const express = require('express');
const router = express.Router();
const User = require("../models/user")
const Progress = require("../models/progress")
const ObjectId = require('mongoose').Types.ObjectId;
let Sentence;

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
 
    
     /* User.findOne({
          name:req.params.username,
      })
      .then(user=>{
        let language=user.language;
        switch (language) {
            case 'russian':
                Sentence = require(`../models/sentence`).russian;
                break;
            case 'french':
                Sentence = require(`../models/sentence`).french;
                break;
            case 'serbian':
                Sentence = require(`../models/sentence`).serbian;
                break;
        } 
        var monsterId=new ObjectId(user._id);
          Progress.find({
              userId:monsterId,
              learned:false,

        })
          .then(progress=>{
            var sentenceId=new ObjectId(progress.sentenceId);
              Sentence.find({_id:sentenceId,})
              res.status(200).json(progress);});
      })*/
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