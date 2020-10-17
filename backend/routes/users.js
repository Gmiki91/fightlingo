const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
//const Sentence = require('../models/sentence');
const router = express.Router();

router.post('/signup', (req,res,next)=>{

    let firstSentences;
    const Sentence = require(`../models/${req.body.language}-sentence`);
    Sentence.find({learned:false, level:1})
    .then(documents=>{
        firstSentences=documents;
    });
    bcrypt.hash(req.body.password,10)
    .then(hash=>{
        const user = new User({
            name: req.body.name,
            password: hash,
            monster: req.body.monster,
            level:req.body.level,
            language:req.body.language,
            sentences:firstSentences
        });
    user.save()
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