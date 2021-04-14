const express = require('express');
const ObjectId = require('mongoose').Types.ObjectId;
const router = express.Router();
const authCheck = require('../middleware/auth-check');
const Publication =  require("../models/publication");
const Question = require("../models/question");

router.post('/', authCheck, (req,res,next)=>{
    const pub = new Publication({
        userId:req.userData.id,
        dateOfPublish:new Date(),
        reviewed:false,
        defended:false,
        popularity:0,
        language:req.userData.language,
        level:req.body.level,
        title:req.body.title,
        text:req.body.text
    });
    pub.save().then((result) => {
        res.status(200).json(result._id);
    })
});

router.post('/addQuestion', (req, res, next)=>{
    const question = new Question({
        publicationId:req.body.publicationId,
        popularity:req.body.popularity,
        question:req.body.question,
        answers:req.body.answers
    });
    question.save().then((result) => {
        res.status(200).json(result._id);
    });
});

router.post('/addAnswer', (req, res, next)=>{
    Question.updateOne({ _id: req.body._id },
        { $push: { answers: req.body.answers }})
        .then(() => res.status(200).json("Answer(s) added"))
});

router.get('/own', authCheck, (req, res, next)=>{
    Publication.find({userId : req.userData.id})
    .then(result => res.send(result));
});


router.get('/all', authCheck, (req, res, next)=>{
    Publication.find({language : req.userData.language})
    .then(result => res.send(result));
});

router.get('/getQuestions/:pubId', (req,res,next)=>{
    Question.find({publicationId: req.params.pubId})
    .then(result=>res.send(result));
});

router.patch('/reviewed', (req, res, next)=>{
    Publication.updateOne({ _id: req.body_id },
        { $set: { "reviewed": true} },
        { new: true },
        (err, pub) => {
            return res.status(200).send({message:"publication reviewed"});
        });
});

router.patch('/defended', (req, res, next)=>{
    Publication.updateOne({ _id: req.body._id },
        { $set: { "defended": true} },
        { new: true },
        (err, pub) => {
            return res.status(200).send({message:"publication defended"});
        });
});

router.patch('/pubPopularityInc', (req, res, next)=>{
    Publication.updateOne({ _id: req.body.id },
        { $inc: { popularity: 1 } })
        .then(() => {
            res.status(200).json("publication liked");
        })
})

router.patch('/questionPopularityInc', (req, res, next)=>{
    Question.updateOne({ _id: req.body.id },
        { $inc: { popularity: 1 } })
        .then(() => {
            res.status(200).json("question liked");
        })
})

router.patch('/pubPopularityDec', (req, res, next)=>{
    Publication.updateOne({ _id: req.body.id },
        { $inc: { popularity: -1 } })
        .then(() => {
            res.status(200).json("publication disliked");
        })
})

router.patch('/questionPopularityDec', (req, res, next)=>{
    Question.updateOne({ _id: req.body.id },
        { $inc: { popularity: -1 } })
        .then(() => {
            res.status(200).json("question disliked");
        })
})

module.exports=router;