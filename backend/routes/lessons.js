const express = require('express');
const router = express.Router();
const Lesson = require("../models/lesson");

router.get('/:language/:level', (req, res, next) => {
    Lesson.find({
        language: req.params.language,
        level: req.params.level
    })
        .then((result) => {
            return res.json(result);
        })
})

router.post('/', (req, res, next) => {
    Lesson.findOne({
        language: req.body.language,
        rank: req.body.rank
    },'name')
        .then((result) => {
            return res.json(result.name);
        })
})
module.exports = router;