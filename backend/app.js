//mongoexport --uri mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/funlingo --collection sentences --out sajt
//mongoimport --uri mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/fightlingo --collection french-sentences --type json --file french
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app=express();
const User = require("./models/user");
const ObjectId = require('mongoose').Types.ObjectId;
//const Sentence=require('./models/sentence');

const userRoutes=require('./routes/users');
const user = require('./models/user');


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

app.get("/api/sentences/overdue/:username",(req,res,next)=>{
  User.find({
        name:req.params.username,
        "sentences.nextReviewDate":{$lte:new Date()}
    })
    .then(documents=>{
        res.status(200).json(documents);
    })
 });

app.get("/api/sentences/learnable/:level/:username",(req,res,next)=>{
    console.log();
    User.find({
        name:req.params.username,
        "sentences.learned":false,
        "sentences.level":req.params.level
    })
    .then(documents=>{
        console.log(documents);
        res.status(200).json(documents);
    })
 });

app.get("/api/sentences/practicable/:level/:username",(req,res,next)=>{
    User.find({
        name:req.params.username,
        "sentences.learned":true,
        "sentences.level":req.params.level
    })
    .then(documents=>{
        res.status(200).json(documents);
    })
 });

 app.patch("/api/sentences", (req,res,next)=>{

     var objId=new ObjectId(req.body[1]._id);

     User.updateOne({_id:req.body[0]._id, "sentences._id":objId},
     {
         "sentences.$.learningProgress":req.body[1].learningProgress,
         "sentences.$.learned":req.body[1].learned,
         "sentences.$.consecutiveCorrectAnswers":req.body[1].consecutiveCorrectAnswers,
         "sentences.$.consecutiveCorrectAnswers":req.body[1].consecutiveCorrectAnswers,
         "sentences.$.interval":req.body[1].interval,
         "sentences.$.difficulty":req.body[1].difficulty,
         "sentences.$.nextReviewDate":req.body[1].nextReviewDate
    },() =>console.log("sentence updated"));
 });

app.use("/api/users", userRoutes);

module.exports=app;