const express = require('express');
const router = express.Router();
const Progress = require("../models/progress");
const Scroll = require("../models/scroll");
const ObjectId = require('mongoose').Types.ObjectId;
const authCheck = require('../middleware/auth-check');
var Sentence;

/*
router.post("/all", (req, res, next)=>{
    instantiateSentence(req.body.language);
    Sentence.find({level: req.body.level})
    .then((sentences) => {
        res.status(200).send(sentences)})
})
*/
//overdue sentences
router.get("/overdue", authCheck, (req, res, next) => {
    instantiateSentence(req.userData.language);
    Progress.find({ userId: req.userData.id, nextReviewDate: { $lte: new Date() } })
        .then(documents => {
            findSentences(documents)
                .then(results => {
                    res.status(200).json(results);
                })
        })
});

//practicable sentences
router.get("/practice/:lessonId", authCheck, (req, res, next) => {
    Scroll.findOne({ _id: req.params.lessonId })
        .then(lesson => findProgress(lesson, true, req.userData.id)
            .then(result => {
                res.status(200).send(result);
            }))
});

//get all learned sentences for fight
router.get("/fight", authCheck, (req, res, next) => {
    instantiateSentence(req.userData.language);
    Progress.find({ userId: req.userData.id, learned: true })
        .then(documents => {
            findSentences(documents)
                .then(results => {
                    res.status(200).json(results);
                })
        })
});

//learnable sentences
router.get("/learn", authCheck, (req, res, next) => {
    Scroll.findOne({ number: req.userData.rank, language: req.userData.language })
        .then(scroll => findProgress(scroll, false, req.userData.id)
            .then(result => {
                res.status(200).send(result);
            }))
});

//update sentences
router.patch("/", (req, res, next) => {
    Progress.updateOne({ _id: req.body._id }, {
        "learningProgress": req.body.learningProgress,
        "learned": req.body.learned,
        "consecutiveCorrectAnswers": req.body.consecutiveCorrectAnswers,
        "interval": req.body.interval,
        "difficulty": req.body.difficulty,
        "nextReviewDate": req.body.nextReviewDate
    }, () => {
        res.status(200).send({ message: "Sentence updated" });
    });
});

function findProgress(lesson, learned, userId) {
    return new Promise(function (resolve, reject) {
        let language = lesson.language;
        instantiateSentence(language);
        Sentence.find({ scroll_id: lesson._id })
            .then(sentences => {
                let sentenceIds = [];
                sentences.forEach(sentence => {
                    sentenceIds.push(new ObjectId(sentence._id));
                })
                Progress.find({ userId: new ObjectId(userId), learned: learned, sentenceId: { $in: sentenceIds } })
                    .then(progressData => {
                        findSentences(progressData)
                            .then(sentences => {
                                resolve(sentences);
                            })
                    })
            })
    })
}

function findSentences(progressData) {
    return new Promise(function (resolve, reject) {
        let progressIds = [];
        progressData.forEach(progress => {
            progressIds.push(new ObjectId(progress.sentenceId));
        })
        Sentence.find({ _id: { $in: progressIds } })
            .then(sentences => {
                resolve(sentences)
            });
    })
}

function instantiateSentence(language) {
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
}

module.exports = router;