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

//Cancel update email verificaation
const cancelUpdateEmailVerification = async(req,res)=>{
    try {
        //Extract token's data
        const {token} = req.params;
        if(!token){
            return res.redirect(`${process.env.FRONT_URL}?status=403`);
        }
        //Extract updatedToken's data
        const decodes = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const updateToken = decodes.updateToken;
        if(!updateToken){
            return res.redirect(`${process.env.FRONT_URL}?status=403`);
        }
        const decodesUpdateToken = jwt.verify(updateToken,process.env.ACCESS_TOKEN_SECRET);
        const updatedUserID =  decodesUpdateToken.userID;
        const newEmail = decodesUpdateToken.userEmail;
        //Add new record 
        const addNewSuspRec  = await securityModel.addNewSuspiciousRecord(updatedUserID,newEmail,'unathorized-email-updated');
        //Check for blacklist
        const addNewBlackListRecord = await securityModel.addNewEmailInBlackList(newEmail);
        
        if(!addNewSuspRec) return res.redirect(`${process.env.FRONT_URL}?status=500`);
        if(addNewBlackListRecord===-1) return res.redirect(`${process.env.FRONT_URL}?status=500`);
        //If everything is fine
        return res.redirect(`${process.env.FRONT_URL}?status=200`);
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.redirect(`${process.env.FRONT_URL}?status=403`);
        }
        return res.redirect(`${process.env.FRONT_URL}?status=500`);
    }
}

module.exports={
    addNewRecord,
    addNewBlackListEmail,
    cancelUpdateEmailVerification
}