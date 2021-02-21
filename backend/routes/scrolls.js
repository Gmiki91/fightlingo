const express = require('express');
const authCheck = require('../middleware/auth-check');
const router = express.Router();
const Scroll = require("../models/scroll");

//get all scrolls
router.get('/', authCheck, (req, res, next) => {
    Scroll.find({
        language: req.userData.language,
    })
        .then((result) => {
            return res.json(result);
        })
})

//get FirstScroll 
router.get('/:language/:number', (req, res, next) => {
    Scroll.findOne({
        language: req.params.language,
        number: req.params.number
    })
        .then((result) => { return res.json(result) })

})
/*
router.get('/oflevel/:language/:level', (req, res, next) => {
    Scroll.find({
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