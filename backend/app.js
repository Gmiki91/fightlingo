//mongoexport --uri mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/funlingo --collection sentences --out sajt
//mongoimport --uri mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/fightlingo --collection french-sentences --type json --file french
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app=express();
const User = require("./models/user");
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
    User.find({
        name:req.params.username,
        "sentences.learned":false,
        "sentences.level":1
    })
    .then(documents=>{
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
     let toBeUpdated;
    // console.log(req.body[1]._id);
     User.findById(req.body[0]._id)
     
     
     
     //user.save();
     User.find({
         "sentences.$.id":"5f89bdf7ecf2c51112421e2f"
     }).then(updatable =>{
         console.log(updatable);
     })

    User.updateOne({"sentences.$._id":req.body[1]._id},{
       /* $set:{sentences:{
            "learned":req.body[1].learned,
            "learningProgress":req.body[1].learningProgress,
            "consecutiveCorrectAnswers":req.body[1].consecutiveCorrectAnswers,
            "interval":req.body[1].interval,
            "difficulty":req.body[1].difficulty,
            "nextReviewDate":req.body[1].nextReviewDate
        }}*/
        $set:{
            "sentences.0.learningProgress":req.body[1].learningProgress
        }
    })
    .then((response)=>{
        res.status(200).json({message:"sentence updated"})
    });
   /* User.find(myquery).then((response)=>console.log("hahó"+response+"v"));
    User.updateOne(myquery,newvalues).then((response)=>{
        res.status(200).json({message:"sentence updated"})
    });*/
 });

app.use("/api/users", userRoutes);

module.exports=app;