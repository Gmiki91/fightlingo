const express = require('express');
app=express();


app.use((req,res,next)=>{
    res.send(" Welcome!"); 
});

module.exports=app;