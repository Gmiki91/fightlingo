//mongoexport --uri mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/funlingo --collection sentences --out sajt
//mongoimport --uri mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/fightlingo --collection serbian_sentences --file imports/languages/serbian
//mongoimport --uri mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/fightlingo --collection lessons --file imports/lessons
//mongoimport --uri mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/fightlingo --collection stories --file imports/stories
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app=express();

const sentencesRoutes = require("./routes/sentences");
const userRoutes=require('./routes/users');
const progressRoutes = require('./routes/progress');
const lessonsRoutes=require('./routes/lessons');

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
//mongoose.set('useFindAndModify', false);

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
    res.setHeader("Cache-Control", "no-cache");
    next();
});

app.use("/api/users", userRoutes);
app.use("/api/sentences",sentencesRoutes);
app.use("/api/progress",progressRoutes);
app.use("/api/lessons",lessonsRoutes);
module.exports=app;