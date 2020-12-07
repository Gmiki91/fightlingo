const express = require('express');
const router = express.Router();
const Lesson = require("../models/lesson");
const Story = require("../models/story");

router.post('/', (req, res, next) => {
    Lesson.findOne({
        language: req.body.language,
        rank: req.body.rank
    },'name')
        .then((result) => {
            return res.json(result.name);
        })
})

router.get('/:language/:level', (req, res, next) => {
    Lesson.find({
        language: req.params.language,
        level: req.params.level
    })
        .then((result) => {
            return res.json(result);
        })
})


router.get('/story/:language/:storyRank',(req,res,next)=>{
    console.log(req.params.language);
    console.log(req.params.storyRank);
    Lesson.findOne({
        language:req.params.language,
        rank:req.params.storyRank},'_id')
        .then((lessonId)=>{
            console.log(lessonId);
            Story.findOne({lessonId:lessonId})
            .then((result) => {return res.json(result)})
        })
})
module.exports = router;