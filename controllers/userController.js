const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');

//userModel
const userModel = require('../models/userModel');
//email service
const emailService = require('../services/emailService');


//Get user's email and fullname
const getUserData = async(req,res)=>{
    try {
        const userId = req.userID;
        const data = await userModel.findByID(userId);
        if(data){
            return res.status(200).json({
                fullName: data.fullName,
                email: data.email
            });
        }else{
            return res.status(404).json({message:"User Not Found"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error during get User email and password"});
    }
}

const updateFullName = async(req,res)=>{
    try {
        const userId = req.userID;
        const newFullName= req.body.fullName;
        await userModel.updateUserFullName(newFullName,userId);
        return res.status(200).json({message:"Update full name"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error during updateUserData"});
    }

}

const updatePassword = async(req,res)=>{
    try {
        const userId = req.userID;
        const newPassword= req.body.password;
        await userModel.updateUserFullName(newPassword,userId);
        return res.status(200).json({message:"Update password"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error during updateUserData"});
    }

}

//Send verification emails to change the password
//Params: old & new email, full name 
const sendVerficationEmails =async (req,res)=>{
    try {
        const userId = req.userID;
        const oldEmail = req.body.oldEmail
        const newEmail = req.body.newEmail;
        const fullName = req.body.fullName;
        //Check if email already used
        const emailAvailiable = await userModel.findEmailAvailiability(newEmail);
        if(!emailAvailiable){
            return res.status(409).json({message:"The email already used"});
        }else{
            //Sends verification emails by emailService.js
            const updateVerifyToken = jwt.sign(
                {
                    userID:userId,
                    userEmail:newEmail
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'15m'}
                );
            const cancelUpdateToken = jwt.sign(
                {
                    userID:userId,
                    updateToken: updateVerifyToken
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'15m'}
                );
            
            const sendInformEmail = await emailService.sendVerificationEmailtoInform(fullName,oldEmail,newEmail,cancelUpdateToken);
            const sendVerifUpdateEmail = await emailService.sendVerificationEmailtoUpdate(fullName,newEmail,updateVerifyToken);
            if(sendInformEmail && sendVerifUpdateEmail){
                return res.status(201).json({message:"Send inform and verification emails"});
            }else{
                return res.status(500).json({message:"At least an email dosen't sended"});
            }

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error during sending ver email"});
    }

}

const updateEmailAfterVerification= async(req,res)=>{
    try {
        const token = req.params.token;
        const decodes = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userID = decodes.userID;
        const userEmail = decodes.userEmail;
        const affectedRows = await userModel.upadateUserEmail(userID,userEmail);
        if(affectedRows>0){
            return res.status(200).json({message:"Update email"});
        }else {
            return res.status(404).json({ message: `User [${userID} | ${affectedRows}] not found or already verified.` });
        }
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: "Verification link is invalid or has expired." });
        }
        return res.status(500).json({message:"server error"});
    }
}

//Cancel update email verificaation
const cancelUpdateEmailVerification = async(req,res)=>{
    try {
        const token = req.params.token;
        const decodes = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const updateToken = decodes.updateToken;
        ///
        
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: "Verification link is invalid or has expired." });
        }
        return res.status(500).json({message:"server error"});
    }
}

//Update user data
const updateUserData = async(req,res)=>{
    try {
        //Get user id
        const userId = req.userID;
        const updatedUserData = {
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        }
        //Hash the password (if exists)
        const salt = 10;
        if(updatedUserData.password && updatedUserData.password.trim()!==''){
            updatedUserData.password = await bcrypt.hash(req.body.password,salt);
        }
        //Update the record
        const affectedTableRows = await userModel.updateUser(updatedUserData.fullName,updatedUserData.email,updatedUserData.password,userId);
        //Check record
        if(affectedTableRows===1){
            return res.status(201).json({message:`Update user with ID:${userId}`});
        }else if(affectedTableRows===-1){
            //email is not availiable
            return res.status(409).json({message:`Email:${req.body.email} is not availiable`});
        }else{
            //User Not found 
            return res.status(404).json({message:`User with ID:${userId} not found`});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error during updateUserData"});
    }
}

//Remove user from the system
//MySQL removes automatically the associate tasks/categories (DELETE CASCADE)
const deregisteredUser = async (req,res)=>{
    try {
        const userId = req.userID;
        //Delete user 
        const affectedRows = await userModel.deleteUser(userId);
        if(affectedRows===1){
            return res.status(201).json({message:`Success deregistered user with id:${userId}`});
        }else{
            //Not found 
            return res.status(404).json({message:`User with id:${userId} not found`});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
}

module.exports ={
    updateFullName,
    updatePassword,
    sendVerficationEmails,
    updateEmailAfterVerification,
    cancelUpdateEmailVerification,
    updateUserData,
    deregisteredUser,
    getUserData
}