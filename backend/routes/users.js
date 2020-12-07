const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Progress = require("../models/progress");
const Lesson = require("../models/lesson");
const router = express.Router();
let Sentence;
let user;

router.post('/signup', (req, res, next) => {
    let language = req.body.language;
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

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            user = new User({
                email: req.body.mail,
                name: req.body.name,
                password: hash,
                pic: req.body.pic,
                level: req.body.level,
                language: req.body.language,
                rank: req.body.rank,
                money: req.body.money,
                hasShipTicket:req.body.hasShipTicket,
                currentStoryFinished: req.body.currentStoryFinished,
                currentLessonFinished:req.body.currentLessonFinished,
                lastLoggedIn: req.body.lastLoggedIn,
            });
            user.save()
                .then(initProgress(req.body.language, req.body.rank))
                .then(result => {
                    res.status(201).json({
                        message: "user created",
                        result: result
                    });
                })
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
});

router.post('/login', (req, res, next) => {
    let userData;
    User.findOne({ name: req.body.name })
        .then(user => {
            
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            let today = new Date();
            today.setHours(0,0,0,0);
            if(user.lastLoggedIn<today && user.currentLessonFinished && user.currentStoryFinished){
                user.rank = user.rank+1;
                user.currentLessonFinished=false;
                user.currentStoryFinished=false;
            }
            user.lastLoggedIn=new Date();
            user.save();
            userData = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            const token = jwt.sign(
                { name: userData.name, userId: userData._id },
                'lol_not_very_cryptic',
                { expiresIn: '1h' }
            );
            res.status(200).json({
                token: token,
                user: userData
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Auth failed"
            });
        })
})

router.post('/byId', (req, res, next) => {
    User.findOne({ _id: req.body._id })
        .then((user) => {
            return res.status(200).send(user)
        })
})

router.patch('/rank', (req, res, next) => {
    if((req.body.rank+1)%2==1) //new lesson only available after beating a master
        initProgress(req.body.language,req.body.rank + 1);
    User.updateOne({ _id: req.body._id },
        { $set: { "rank": req.body.rank + 1 } },
        () => {
            res.status(200).send({ message: "User rank updated" });
        });
});

router.patch('/level', (req, res, next) => {

    User.updateOne({ _id: req.body._id },
        { $set: { "level": req.body.level + 1 } },
        () => {
            res.status(200).send({ message: "User leveled up" });
        });
});



router.patch('/currentLessonFinished', (req, res, next) => {
    User.updateOne({ _id: req.body._id },
        { $set: { "currentLessonFinished": req.body.currentLessonFinished } },
        () => {
            res.status(200).send({ message: "Lesson learned" });
        });
});

router.patch('/currentStoryFinished', (req, res, next) => {
    User.updateOne({ _id: req.body._id },
        { $set: { "currentStoryFinished": req.body.currentStoryFinished } },
        () => {
            res.status(200).send({ message: "Story learned" });
        });
});

router.patch('/money/:money', (req, res, next) => {
    User.updateOne({ _id: req.body._id },
        { $inc: { "money": req.params.money } },
        () => {
            res.status(200).send({ message: "Cha ching!" });
        });
});


function initProgress(language, rank) {
    console.log("rank: " + rank);
    Lesson.findOne({
        language: language,
        rank: rank
    }, '_id')
        .then(id => Sentence.find({"lesson_id": id._id })
            .then(documents => {
                for (let document of documents) {
                    const prog = new Progress({
                        sentenceId: document._id,
                        userId: user._id,
                        learned: false,
                        learningProgress: 4,
                        consecutiveCorrectAnswers: 0,
                        interval: 1,
                        difficulty: 2.5,
                        nextReviewDate: null
                    });
                    prog.save();
                }
            })
        )
}
module.exports = router;