const ObjectId = require('mongoose').Types.ObjectId;
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
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
                email: req.body.email,
                password: hash,
                currentCharacter: null,
            });
            user.save()
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
    User.findOne({ email: req.body.email })
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
            const token = getToken(userData);
            res.setHeader('Authorization', 'Bearer ' + token);
            res.status(200).json({ user: userData, token: token });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Auth failed"
            });
        })
})



router.patch('/selectCurrentCharacter', authCheck, (req, res, next) => {
    User.updateOne({ _id: req.userData.id },
        { $set: { "currentCharacter": req.body.charId } },
        (err, user) => {
            return res.status(200).send({ message: "character selected" });
        });
})

router.get('/refreshUser', authCheck, (req, res, next) => {
    User.findOne({ _id: new ObjectId(req.userData.id) })
        .then((user) => {
            const token = getToken(user);
            return res.status(200).send({ user: user, token: token })
        })
})

function getToken(user) {
    return jwt.sign(
        {
            userId: user._id,
            characterId: user.currentCharacter
        },
        process.env.JWT_KEY,
        { expiresIn: '1h' }

    );
}

module.exports = router;