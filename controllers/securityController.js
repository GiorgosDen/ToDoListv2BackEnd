const securityModel = require('../models/securityModel');

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
            return res.status(403).json({ message: "Token not found" });
        }
        //Extract updatedToken's data
        const decodes = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const updateToken = decodes.updateToken;
        if(!updateToken){
            return res.status(403).json({ message: "Token not found" });
        }
        const decodesUpdateToken = jwt.verify(updateToken,process.env.ACCESS_TOKEN_SECRET);
        const updatedUserID =  decodesUpdateToken.userID;
        const newEmail = decodesUpdateToken.userEmail;
        //Add new record 
        //Check for blacklist

    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: "Verification link is invalid or has expired." });
        }
        return res.status(500).json({message:"server error"});
    }
}

module.exports={
    addNewRecord,
    addNewBlackListEmail,
    cancelUpdateEmailVerification
}