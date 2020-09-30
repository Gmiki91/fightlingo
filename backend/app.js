//mongoexport --uri mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/funlingo --collection sentences --out sajt
//mongoimport --uri mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/fightlingo --collection sentences --type json --file sajt

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app=express();
const Sentence=require('./models/sentence');

mongoose.connect(
    "mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/fightlingo?retryWrites=true&w=majority",
    {useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>{
    console.log("connected to database!");
}).catch((err)=>{
    console.log("connection to database failed" + err); 
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", 
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.get("/api/sentences",(req,res,next)=>{
    Sentence.find().then(documents=>{
        res.status(200).json(documents);
    })
 });

 app.patch("/api/sentences", (req,res,next)=>{
     const sentence = new Sentence({
         _id: req.body._id,
         english: req.body.english,
         translations: req.body.translations,
         level: req.body.level,
         lesson: req.body.lesson,
         consecutiveCorrectAnswers: req.body.consecutiveCorrectAnswers,
         interval: req.body.interval,
         difficulty: req.body.difficulty,
         nextReviewDate: req.body.nextReviewDate
     });

     Sentence.updateOne({_id:req.body._id},sentence)
     .then((response)=>{
         res.status(200).json({message:"sentence updated"})
     });
 })

module.exports=app;