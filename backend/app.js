const express = require('express');
app=express();

app.use((req,res,next)=>{
    
    next();
});

app.use((req,res,next)=>{
    res.send(" ...and welcome!"); 
});

module.exports=app;