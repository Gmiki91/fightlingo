//mongoexport --uri mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/funlingo --collection sentences --out sajt
//mongoimport --uri mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/fightlingo --collection russian_sentences --file imports/languages/russian
//mongoimport --uri mongodb+srv://miki:FwhXUcInB4tqWK8L@cluster0.hakyf.mongodb.net/fightlingo --collection scrolls --file imports/scrolls
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app=express();

const sentencesRoutes = require("./routes/sentences");
const userRoutes=require('./routes/users');
const progressRoutes = require('./routes/progress');
const scrollsRoute=require('./routes/scrolls');
const publicationsRoute=require('./routes/publications');

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

mongoose.connect(
    "mongodb+srv://miki:"+process.env.MONGO_ATLAS_PW+"@cluster0.hakyf.mongodb.net/fightlingo?retryWrites=true&w=majority",
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
     "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", 
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.setHeader("Cache-Control", "no-cache");
    next();
});

app.use("/api/users", userRoutes);
app.use("/api/sentences",sentencesRoutes);
app.use("/api/progress",progressRoutes);
app.use("/api/scrolls",scrollsRoute);
app.use("/api/publications", publicationsRoute);
module.exports=app;