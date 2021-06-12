const express = require('express');
const ObjectId = require('mongoose').Types.ObjectId;
const jwt = require("jsonwebtoken");
const authCheck = require('../middleware/auth-check');
const router = express.Router();
const Character = require("../models/character");
const Scroll = require("../models/scroll");
const Progress = require("../models/progress");
let Sentence;
let character;

router.post('/create', authCheck, (req, res, next) => {
    let language = 'russian'; // req.body.language;
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

    character = new Character({
        userId: req.userData.id,
        name: "jani",
        pic: "szorny1",
        level: 0,
        language: "russian",
        rank: 0,
        strength: 1,
        hitpoint: 1,
        money: 3,
        hasShipTicket: false,
        lastLoggedIn: new Date(),
        scrollFinished: new Date(),
        lastLecture: new Date(new Date().getTime() - 1000 * 86400),
        confirmed: false,
        isReadyForExam: false

    });
    character.save()
        .then(initProgressFirst("russian", 0))//(req.body.language, req.body.rank))
        .then(() => {
            const token = getToken(character);

            return res.json({
                char: character,
                token: token
            });
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
});

router.get('/findByUserId/:id', (req, res, next) => {
    Character.find({ userId: new ObjectId(req.params.id) })
        .then((result) => {
            return res.json(result);
        })
})

router.get('/currentCharacter', authCheck, (req, res, next) => {
    Character.findOne({ _id: new ObjectId(req.userData.characterId) },)
        .then((char) => {
            const token = getToken(char);
            return res.status(200).send({ char: char, token: token })
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
})

router.get('/finishedAt', authCheck, (req, res, next) => {
    Character.findOne({ _id: req.userData.characterId }, 'scrollFinished').then((result) => { return res.status(200).send(result.scrollFinished) });
})

router.patch('/rank', authCheck, (req, res, next) => {
    initProgress(req.userData.language, req.userData.rank + 1);
    Character.findOneAndUpdate({ _id: req.userData.characterId },
        {
            $set: {
                "rank": req.userData.rank + 1,
                "scrollFinished": new Date()
            }
        },
        { new: true },
        (err, user) => {
            return res.status(200).send(user);
        });
})

router.patch('/level', authCheck, (req, res, next) => {
    initProgress(req.userData.language, req.userData.rank + 1);
    Character.findOneAndUpdate({ _id: req.userData.characterId },
        {
            $set: {
                "level": req.userData.level + 1,
                "rank": req.userData.rank + 1,
                "isReadyForExam": false
            }
        },
        { new: true },
        (err, user) => {
            return res.status(200).send(user);
        });
})

router.patch('/confirm', authCheck, (req, res, next) => {
    Character.findOneAndUpdate({ _id: req.userData.characterId },
        { $set: { "confirmed": true } },
        { new: true },
        (err, user) => {
            return res.status(200).send(user);
        });
})

router.patch('/readyForExam', authCheck, (req, res, next) => {
    Character.findOneAndUpdate({ _id: req.userData.characterId },
        { $set: { "isReadyForExam": true } },
        { new: true },
        (err, user) => {
            return res.status(200).send(user);
        });
})

router.patch('/gaveLecture', authCheck, (req, res, next) => {
    Character.findOneAndUpdate({ _id: req.userData.characterId },
        { $set: { "lastLecture": new Date() } },
        { new: true },
        (err, user) => {
            return res.status(200).send(user);
        });
})

router.patch('/updateMoney', authCheck, (req, res, next) => {
    Character.updateOne({ _id: req.userData.characterId },
        { $inc: { money: req.body.amount } })
        .then(() => {
            return res.status(200).send({ message: "money updated" });
        });
})

router.patch('/giveMoney', (req, res, next) => {
    Character.updateOne({ _id: req.body.currentCharacter },
        { $inc: { money: req.body.amount } })
        .then(() => {
            return res.status(200).send({ message: "money sent" });
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
                            characterId: character._id,
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
                            characterId: character._id,
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

function getToken(character) {
    return jwt.sign(
        {
            userId: character.userId,
            characterId: character._id,
            level: character.level,
            rank: character.rank,
            money: character.money,
            language: character.language,
            name: character.name
        },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
    );

}

module.exports = router;