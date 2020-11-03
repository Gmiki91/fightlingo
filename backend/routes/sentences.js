const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Lesson = require("../models/lesson");
const Progress = require("../models/progress");
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
  

// learnable sentences
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
            let sentenceIds = [];
            sentences.forEach(sentence => {
                sentenceIds.push(new ObjectId(sentence._id));
            })
            Progress.find({userId:new ObjectId(req.body._id),learned:false,sentenceId:{$in:sentenceIds}})
            .then(progressData=>{
                let progressIds=[];
                progressData.forEach(progress=>{
                    progressIds.push(new ObjectId(progress.sentenceId));
                })
                Sentence.find({_id:{$in:progressIds}})
                .then(sentences=> {
                    res.status(200).json(sentences)
                })
            })
        })
    }) 
})
  
router.patch("/", (req,res,next)=>{
       Progress.updateOne({_id:req.body._id},{
        "learningProgress":req.body.learningProgress,
        "learned":req.body.learned,
        "consecutiveCorrectAnswers":req.body.consecutiveCorrectAnswers,
        "interval":req.body.interval,
        "difficulty":req.body.difficulty,
        "nextReviewDate":req.body.nextReviewDate
       },()=>console.log("sentence updated"));
   });

module.exports= router;