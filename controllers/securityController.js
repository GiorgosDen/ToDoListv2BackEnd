const securityModel = require('../models/securityModel');
const jwt = require('jsonwebtoken');

const addNewRecord = async(req,res)=>{
    try {
        const email = req.body.email;
        const userId = req.userID;
        const event = "unauthorized update email";
        const result = await securityModel.addNewSuspiciousRecord(userId,email,event);
        if(result){
            return res.status(200).json({message:"Add new Susspicious Record"});
        }else{
            return res.status(500).json({message:"Server error"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error during add new record"});
    }
}

const addNewBlackListEmail = async(req,res)=>{
    try {
        const email = req.body.email;
        const result = await securityModel.addNewEmailInBlackList(email);
        if(result===1){
            res.status(200).json({message:"Add new blacklist record"});
        }
        //???
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error during add new blacklist mail"});
    }
}

module.exports={
    addNewRecord,
    addNewBlackListEmail,
}