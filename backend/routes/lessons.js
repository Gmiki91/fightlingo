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
module.exports= router;