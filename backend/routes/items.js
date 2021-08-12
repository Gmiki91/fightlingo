const express = require('express');
const authCheck = require('../middleware/auth-check');
const router = express.Router();
const Item = require("../models/item");

router.get('/all', authCheck, (req, res, next) => {
    Item.find({
        $or:
            [
                { level: { $lte: req.userData.level } },
                { level: { $exists: false } }
            ]
    })
        .then(result => {
            return res.json(result);
        })
})

router.get('/rare', authCheck, (req, res, next) => {
    Item.find({
        $and:
            [
                { level: { $lte: req.userData.level } },
                { level: { $gte: req.userData.level - 2 } },
                {
                    $or: [
                        { rarity: "rare" },
                        { rarity: "legendary" }
                    ]
                }
            ]
    })
        .then(result => {
            return res.json(result);
        })
})

router.get('/', authCheck, (req, res, next) => {
    Item.find({ _id: { $in: req.query.items } })
        .then(result => { return res.json(result) })
})

module.exports = router;