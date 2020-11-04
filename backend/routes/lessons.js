const express = require('express');
const router = express.Router();
const Lesson = require("../models/lesson");

router.get('/:language', (req, res, next) => {
    Lesson.find({ language: req.params.language })
    .then((result) => {
        return res.json(result);
    })
})

module.exports= router;