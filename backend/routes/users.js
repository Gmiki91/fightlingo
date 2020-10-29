const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Progress = require("../models/progress");
const router = express.Router();
let Sentence;
let user;

router.post('/signup', (req,res,next)=>{

    let language = req.body.language;
    switch (language) {
        case 'russian':
            Sentence = require(`../models/sentence`).russian;
            break;
        case 'french':
            Sentence = require(`../models/sentence`).french;
            break;
    }
    
    bcrypt.hash(req.body.password,10)
    .then(hash=>{
         user = new User({
            name: req.body.name,
            password: hash,
            monster: req.body.monster,
            level:req.body.level,
            language:req.body.language,
        });
    user.save()
    .then(
        Sentence.find({level:1})
            .then(documents=>{
                for (let document of documents) {
                    console.log(document);
                    const prog=new Progress({
                        sentenceId:document._id,
                        userId:user._id,
                        learned:false,
                        learningProgress:0,
                        consecutiveCorrectAnswers:0,
                        interval:1,
                        difficulty:2.5,
                        nextReviewDate:null
                    });
                    prog.save();
        }
    })
    )
    .then(result=>{
        res.status(201).json({
            message:"user created",
            result:result
        });
    })
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
});

router.post('/login', (req,res,next)=>{
    let userData;
    User.findOne({name: req.body.name})
    .then(user=>{
        if(!user){
          return res.status(404).json({
              message:"User not found"
          });
        }
        userData=user;
       return bcrypt.compare(req.body.password,user.password);
    })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        const token = jwt.sign(
            {name:userData.name, userId: userData._id},
            'lol_not_very_cryptic',
            {expiresIn: '1h'}
        );
        res.status(200).json({
            token:token,
            user:userData
        });
    })
    .catch(err=>{
        return res.status(401).json({
            message: "Auth failed"
        });
    })
})

module.exports= router;