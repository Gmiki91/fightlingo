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
                'lol_not_very_cryptic',
                { expiresIn: '1h' }
            );
            res.setHeader('Authorization', 'Bearer ' + token);
            res.status(200).json({
                token: token,
                userId: userData._id,
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
            return res.status(200).send(user)
        })
})

router.patch('/rank', authCheck, (req, res, next) => {
    initProgress(req.userData.language, req.userData.rank + 1);
    User.findOneAndUpdate({ _id: req.userData.id },
        { $set: { "rank": req.userData.rank + 1 } },
        { new: true },
        (err, user) => {
            return res.status(200).send(user);
        });
});

router.patch('/level', authCheck, (req, res, next) => {
    User.updateOne({ _id: req.userData.id },
        { $set: { "level": req.userData.level + 1 } },
        { new: true },
        (err, user) => {
            return res.status(200).send(user);
        });
});

function initProgress(language, rank) {
    Scroll.findOne({
        language: language,
        number: rank
    }, '_id')
        .then(id => Sentence.find({ "scroll_id": id._id })
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