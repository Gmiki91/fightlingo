const ObjectId = require('mongoose').Types.ObjectId;
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Progress = require("../models/progress");
const Scroll = require("../models/scroll");
const authCheck = require('../middleware/auth-check');
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
                hasShipTicket: req.body.hasShipTicket,
                lastLoggedIn: req.body.lastLoggedIn,
                confirmed:false,
            });
            user.save()
                .then(initProgressFirst(req.body.language, req.body.rank))
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
                {
                    userName: userData.name,
                    userId: userData._id,
                    userLevel:userData.level,
                    userRank:userData.rank,
                    userMoney:userData.money,
                    userLanguage:userData.language,
                },
                process.env.JWT_KEY,
                { expiresIn: '1h' }
            );
            res.setHeader('Authorization', 'Bearer ' + token);
            res.status(200).json({
                token: token,
                userId: userData._id,
                confirmed:userData.confirmed,
                user: userData
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Auth failed"
            });
        })
})


router.get('/:id', (req, res, next) => {
    User.findOne({ _id: new ObjectId(req.params.id) })
        .then((user) => {
            const token = jwt.sign(
                {
                    userName: user.name,
                    userId: user._id,
                    userLevel:user.level,
                    userRank:user.rank,
                    userMoney:user.money,
                    userLanguage:user.language,
                },
                process.env.JWT_KEY,
                { expiresIn: '1h' }
            );
            res.setHeader('Authorization', 'Bearer ' + token);
            return res.status(200).send({user:user, token:token})
        })
})


router.patch('/rank', authCheck, (req, res, next) => {
    initProgress(req.userData.language, req.userData.rank + 1);
    User.findOneAndUpdate({ _id: req.userData.id },
        { $set: { "rank": req.userData.rank + 1 } },
        { new: true },
        (err, user) => {
            return res.status(200).send({message:"rank updated"});
        });
});

router.patch('/level', authCheck, (req, res, next) => {
    User.updateOne({ _id: req.userData.id },
        { $set: { "level": req.userData.level + 1 } },
        { new: true },
        (err, user) => {
            return res.status(200).send({message:"level updated"});
        });
});

router.patch('/confirm', authCheck, (req, res, next) => {
    User.updateOne({ _id: req.userData.id },
        { $set: { "confirmed": true} },
        { new: true },
        (err, user) => {
            return res.status(200).send({message:"user confirmed"});
        });
})

function initProgress(language, rank) {
    Scroll.findOne({
        language: language,
        number: rank
    }, '_id')
        .then(id => 
            Sentence.find({ "scroll_id": id._id })
            .then(documents => {
                for (let document of documents) {
                    const prog = new Progress({
                        sentenceId: document._id,
                        userId: user._id,
                        learned: false,
                        learningProgress: 0,
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

function initProgressFirst(language, rank) {
    Scroll.findOne({
        language: language,
        number: rank
    }, '_id')
        .then(id => 
            Sentence.find({ "scroll_id": id._id })
            .then(documents => {
                for (let document of documents) {
                    const prog = new Progress({
                        sentenceId: document._id,
                        userId: user._id,
                        learned: true,
                        learningProgress: 5,
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