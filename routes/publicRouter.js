//Cron-job.org can access to checks server (keep it awake) 
const express = require('express');
const app = express.Router();

app.get('/health',(req,res)=>{
    res.status(200).json({message:"Ok"});
});

module.exports = app;