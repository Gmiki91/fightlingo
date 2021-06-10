const express = require('express');
const ObjectId = require('mongoose').Types.ObjectId;
const authCheck = require('../middleware/auth-check');
const router = express.Router();
const Character = require("../models/character");
const Scroll = require("../models/scroll");
const Progress = require("../models/progress");
let Sentence;
let character;
router.post('/create',authCheck, (req, res, next) => {
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
        userId:req.userData.id,
        name: "jani",
        pic: "szorny1",
        level: 1,
        language: "russian",
        rank: 1,
        strength: 1,
        hitpoint: 1,
        money:3,
        hasShipTicket:false,
        lastLoggedIn: new Date(),
        scrollFinished: new Date(),
        lastLecture: new Date(new Date().getTime() - 1000 * 86400),
        confirmed: false,
        isReadyForExam: false
        /*
        name: req.body.name,
        pic: req.body.pic,
        level: req.body.level,
        language: req.body.language,
        rank: req.body.rank,
        strength: req.body.strength,
        hitpoint: req.body.hitpoint,
        money: req.body.money,
        hasShipTicket: req.body.hasShipTicket,
        lastLoggedIn: req.body.lastLoggedIn,
        scrollFinished: req.body.scrollFinished,
        lastLecture: new Date(new Date().getTime() - 1000 * 86400),
        confirmed: false,
        isReadyForExam: false
        */
    });
    character.save()
        .then(initProgressFirst("russian", 0))//(req.body.language, req.body.rank))
        .then(result => {
            res.status(201).json({
                message: "character created",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
});

router.get('/findByUserId/:id', (req, res, next) => {
    Character.find({ userId: new ObjectId(req.params.id) })
    .then((result) => {
        return res.json(result);
    })
})

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

module.exports = router;