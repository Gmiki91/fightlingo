const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Lesson = require("../models/lesson");
const ObjectId = require('mongoose').Types.ObjectId;
var Sentence;

router.get("/overdue/:username",(req,res,next)=>{
    User.find({
          name:req.params.username,
          "sentences.nextReviewDate":{$lte:new Date()}
      })
      .then(documents=>{
          res.status(200).json(documents);
      })
   });
  
router.post("/",(req,res,next)=>{
    Lesson.findOne({rank:req.body.rank+1, language:req.body.language}) //user rank starts at 0
    .then(lesson=>{
        let language=req.body.language;
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
        };
        Sentence.find({lesson_id:lesson._id})
        .then(sentences=>{
            res.status(200).json(sentences);
        })
    });
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