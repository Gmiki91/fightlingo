const express = require('express');
const router = express.Router();
const Scroll = require("../models/scroll");


router.get('/oflevel/:language/:level', (req, res, next) => {
    Scroll.find({
        language: req.params.language,
        level: req.params.level
    })
        .then((result) => {
            return res.json(result);
        })
})

router.get('/:language', (req, res, next) => {
    Scroll.find({
        language: req.params.language,
    })
        .then((result) => {
            return res.json(result);
        })
})

router.get('/:language/:storyRank', (req, res, next) => {
    Lesson.findOne({
        language: req.params.language,
        rank: req.params.storyRank
    }, '_id')
        .then((id) => {
            Scroll.findOne({ lessonId: id })
                .then((result) => { return res.json(result) })
        })
})
/*
router.post('/', (req, res, next) => {
    Lesson.findOne({
        language: req.body.language,
        rank: req.body.rank
    }, 'name')
        .then((result) => {
            return res.json(result.name);
        })
})



router.get('/overview/:lessonId', (req, res, next) => {
    Lesson.findOne({
        _id: req.params.lessonId
    }, 'overview')
        .then((result) => {
            return res.json(result.overview);
        })
})



*/
module.exports = router;