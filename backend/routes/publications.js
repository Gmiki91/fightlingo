const express = require('express');
const ObjectId = require('mongoose').Types.ObjectId;
const router = express.Router();
const authCheck = require('../middleware/auth-check');
const Publication = require("../models/publication");
const Question = require("../models/question");


// Posts

router.post('/', authCheck, (req, res, next) => {
    const pub = new Publication({
        userId: req.userData.id,
        dateOfPublish: new Date(),
        dateOfLastLecture: null,
        reviewed: false,
        popularity: 0,
        language: req.userData.language,
        level: req.body.level,
        title: req.body.title,
        text: req.body.text,
        author: req.userData.userName,
        numberOfQuestions: req.body.numberOfQuestions
    });
    pub.save().then((result) => {
        res.status(200).json(result._id);
    })
});

router.post('/addQuestion', authCheck, (req, res, next) => {
    const question = new Question({
        publicationId: req.body.publicationId,
        popularity: req.body.popularity,
        question: req.body.question,
        answers: req.body.answers,
        userId: req.userData.id,
        votedBy: []
    });
    question.save();


    Publication.findOneAndUpdate({ _id: new ObjectId(req.body.publicationId) },
        {
            $inc: { numberOfQuestions: 1 }
        }).then((publication) => {
            if (publication.numberOfQuestions > 4) {
                Publication.updateOne({ _id: req.body.publicationId, reviewed: false },
                        {
                            $set: {
                                "reviewed": true,
                                "dateOfPublish": new Date(),
                                "dateOfLastLecture": new Date(new Date().getTime() - 1000 * 86400)
                            }
                        })
                    .then((result) => {
                        nowReviewed = result != null;
                        res.status(200).json(nowReviewed);
                    });
            } else {
                res.status(200).json(false);
            }
        });
});

router.post('/addAnswer', (req, res, next) => {
    Question.updateOne({ _id: req.body._id },
        { $push: { answers: req.body.answers } })
        .then(() => res.status(200).json("Answer(s) added"))
});

// Own Publications

router.get('/numberOfOwnPublications', authCheck, (req, res, next) => {
    Publication.find({ userId: req.userData.id, dateOfPublish: { $gte: new Date().getTime() - 1000 * 86400 * 30 } })
        .then(result => res.send(result));
});

router.get('/submitted', authCheck, (req, res, next) => {
    Publication.find({ userId: req.userData.id, reviewed: false })
        .then(result => res.send(result));
});


router.get('/published', authCheck, (req, res, next) => {
    Publication.find({ userId: req.userData.id, reviewed: true })
        .then(result => res.send(result));
});

// All publications

router.get('/archived', authCheck, (req, res, next) => {
    Publication.find({ language: req.userData.language, dateOfPublish: { $lte: new Date().getTime() - 1000 * 86400 * 30 } }) //more than 30 days old
        .then(result => res.send(result));
});

router.get('/reviewed', authCheck, (req, res, next) => {
    Publication.find({
        language: req.userData.language,
        reviewed: true,
        dateOfLastLecture: { $lte: new Date().getTime() - 1000 * 7200 }, // last lectrue is more than 2 hours ago
        dateOfPublish: { $gte: new Date().getTime() - 1000 * 86400 * 30 }
    }) //less than 30 days old
        .then(result => res.send(result));
});

router.get('/notReviewed', authCheck, (req, res, next) => {
    Publication.find({ language: req.userData.language, reviewed: false, dateOfPublish: { $gte: new Date().getTime() - 1000 * 86400 * 1 } }) //less than 1 day old
        .then(result => res.send(result));
});

router.get('/getQuestions/:pubId', (req, res, next) => {
    Question.find({ publicationId: req.params.pubId })
        .then(result => res.send(result));
});

router.get('/:id', (req, res, next) => {
    Publication.findOne({ _id: req.params.id }).then(result => res.send(result));
})
//Updates

router.patch('/reviewed', (req, res, next) => {
    Publication.updateOne({ _id: req.body_id },
        { $set: { "reviewed": true } },
        { new: true },
        (err, pub) => {
            return res.status(200).send({ message: "publication reviewed" });
        });
});

router.patch('/hasBeenTaught', (req, res, next) => {
    Publication.updateOne({ _id: req.body._id },
        { $set: { "dateOfLastLecture": new Date() } },
        { new: true },
        (err, pub) => {
            return res.status(200).json(pub._id);
        });
});

router.patch('/likeQuestion', authCheck, (req, res, next) => {
    Question.findOneAndUpdate({ _id: new ObjectId(req.body.id) },
        {
            $inc: { popularity: req.body.like },
            $push: { votedBy: req.userData.id }
        }).then((question) => {
            return res.status(200).json(question.publicationId);
        })
})

/*
router.patch('/questionPopularityInc',authCheck, (req, res, next) => {
    Question.updateOne({ _id: req.body.id },
        { $inc: { popularity: 1 } },
        { $push: { votedBy: req.userData.id } })
        .then(() => {
            res.status(200).json("question liked");
        })
})
 
router.patch('/pubPopularityInc', (req, res, next) => {
    Publication.updateOne({ _id: req.body.id },
        { $inc: { popularity: 1 } })
        .then(() => {
            res.status(200).json("publication liked");
        })
})
 
router.patch('/pubPopularityDec', (req, res, next) => {
    Publication.updateOne({ _id: req.body.id },
        { $inc: { popularity: -1 } })
        .then(() => {
            res.status(200).json("publication disliked");
        })
})
 
*/

router.patch('/delete', (req, res) => {
    Publication.deleteMany({
        dateOfPublish: { $lte: new Date().getTime() - 1000 * 86400 * 1 },
        $or: [
            { "reviewed": false },
            { "defended": false },
        ]
    }).then(() => {
        res.status(200).json("Old pubs deleted")
    });
})


module.exports = router;