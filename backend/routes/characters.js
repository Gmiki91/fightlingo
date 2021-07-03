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
    let language = req.body.language;
    instantiateSentence(language);

    character = new Character({
        userId: req.userData.id,
        name: req.body.name,
        pic: req.body.avatar,
        level: 0,
        language: req.body.language,
        rank: 0,
        strength: 1,
        hitpoint: 1,
        money: 3,
        equippedStaff: null,
        equippedRobe: "robe00",
        items: [],
        brokens: [],
        hasShipTicket: false,
        lastLoggedIn: new Date(),
        scrollFinished: new Date(),
        lastLecture: new Date(new Date().getTime() - 1000 * 86400),
        confirmed: false,
        isReadyForExam: false

    });
    character.save()
        .then(initProgressFirst(req.body.language, 0))
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

router.get('/findByUserId', authCheck, (req, res, next) => {
    Character.find({ userId: new ObjectId(req.userData.id) })
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

router.delete('/deleteCharacter/:id', authCheck, (req,res,next)=>{
    Character.deleteOne({ _id: req.params.id }).then(()=>{return res.status(200).json("Character deleted")});
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

router.patch('/equipRobe', authCheck, (req, res, next) => {
    Character.findOne({ _id: req.userData.characterId }).then(char => {
        if(req.body.item == null || char.equippedRobe!=null){
            char.items.push(char.equippedRobe._id);
        }
        if(req.body.item != null){
            const index = char.items.findIndex(element => element === req.body.item._id);
            char.items.splice(index, 1);
        }
        char.equippedRobe = req.body.item;
        char.save().then((char) => {
            return res.status(200).send(char);
        });
    });
})

router.patch('/equipStaff', authCheck, (req, res, next) => {
    Character.findOne({ _id: req.userData.characterId }).then(char => {
        if(req.body.item == null || char.equippedStaff!=null){
            char.items.push(char.equippedStaff._id);
        }if(req.body.item != null){
            const index = char.items.findIndex(element => element === req.body.item._id);
            char.items.splice(index, 1);
        }
        
        char.equippedStaff = req.body.item;
        char.save().then((char) => {
            return res.status(200).send(char);
        });
    });
})

router.patch('/brokeCommonStaff', authCheck, (req, res, next) => {
    Character.findOneAndUpdate({ _id: req.userData.characterId },
        {
            $set: { "equippedStaff": null },
            $pull: { items: req.body.item }
        },
        { new: true },
        (err, user) => {
            return res.status(200).send(user);
        });
})

router.patch('/brokeRareStaff', authCheck, (req, res, next) => {
    Character.findOneAndUpdate({ _id: req.userData.characterId },
        {
            $set: { "equippedStaff": null },
            $pull: { items: req.body.item },
            $push: { brokens: req.body.item }
        },
        { new: true },
        (err, user) => {
            return res.status(200).send(user);
        });
})

router.patch('/repairItem', authCheck, (req, res, next) => {
    Character.findOneAndUpdate({ _id: req.userData.characterId },
        {
            $push: { items: req.body.item },
            $pull: { brokens: req.body.item },
            $inc: { money: -req.body.item.price * 0.66 }
        },
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
    Character.updateOne({ _id: req.body.id },
        { $inc: { money: req.body.amount } })
        .then(() => {
            return res.status(200).send({ message: "money sent" });
        });
})

router.patch('/buy', authCheck, (req, res, next) => {
    Character.updateOne({ _id: req.userData.characterId },
        {
            $push: { items: req.body.item._id },
            $inc: { money: -req.body.item.price }
        })
        .then(() => {
            return res.status(200).send({ message: "item added" });
        });
})

router.patch('/sell', authCheck, (req, res, next) => {
    Character.findOne({ _id: req.userData.characterId }).then(char => {
        const index = char.items.findIndex(element => element === req.body.item._id);
        char.items.splice(index, 1);
        char.money += req.body.item.price / 3;
        char.save().then(() => {
            return res.status(200).send({ message: "item sold" });
        })
    });
})

router.patch('/removeItems', authCheck, (req, res, next) => {
    Character.updateOne({ _id: req.userData.characterId },
        {
            $pullAll: { pocket: req.body.items },
        })
        .then(() => {
            return res.status(200).send({ message: "item removed from pocket" });
        });
})


router.patch('/putInPocket', authCheck, (req, res, next) => {
    Character.findOne({ _id: req.userData.characterId }).then(char => {
        const index = char.items.findIndex(element => element === req.body.item._id);
        char.items.splice(index, 1);
        char.pocket.push(req.body.item);
        char.save().then(() => {
            return res.status(200).send({ message: "item put in pocket" });
        })
    });

})

router.patch('/removeFromPocket', authCheck, (req, res, next) => {
    Character.updateOne({ _id: req.userData.characterId },
        {
            $pull: { pocket: req.body.item },
            $push: { items: req.body.item._id }
        })
        .then(() => {
            return res.status(200).send({ message: "item removed from pocket" });
        });
})

function initProgress(language, rank) {
    instantiateSentence(language);
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
    instantiateSentence(language);
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