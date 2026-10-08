const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');

//userModel
const userModel = require('../models/userModel');
//email service
const emailService = require('../services/emailService');
//security model
const securityModel = require('../models/securityModel');

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
        console.log("updateFullName Controller receives userID=",userId);
        const newFullName= req.body.fullName;
        console.log("updateFullName Controller receives new Name=",newFullName);
        const result = await userModel.updateUserFullName(newFullName,userId);
        if(result>0){
            return res.status(200).json({message:"Update full name"});
        }else{
            return res.status(404).json({message:"User not found"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error during updateUserData"});
    }

}

const updatePassword = async(req,res)=>{
    try {
        const userId = req.userID;//From JWTs decode
        const newPassword= req.body.password;//User's new password
        const currentPassword = req.body.curPassword;//User's old/current password
        const result = await userModel.updateUserPassword(newPassword,currentPassword,userId);
        if(result>0){
            return res.status(200).json({message:"Update password"});
        }else if(result===0){
            return res.status(404).json({message:"User not found"});
        }else{
            return res.status(400).json({message:"Wrong Current Password"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error during updateUserData"});
    }

}

//Send verification emails to change the email
//Params: old & new email, full name 
const sendVerficationEmailsToUpdateEmail =async (req,res)=>{
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
            //Check If a user tries already to update with this email today
            const dailyAttempts = await securityModel.getDailyAccountUpdateEmailAttemps(userId,newEmail);
            console.log("Attemps: ",dailyAttempts);
            if(dailyAttempts>=1){
                return res.status(429).json({message:"You can only try to update your email with a specific email once per day"});
            }
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

const deactivateAndSendCancelationEmail = async (req,res)=>{
    try {
        const userId = req.userID;
        const userFullName = req.body.userFullName;
        const userEmail = req.body.userEmail;
        console.log("Deactivate account with ID",userId);
        const deactivateAccount = await userModel.deactivateUserAccount(userId);
        //return the affected rows-> 1 in case that deactivates the user account 
        if(deactivateAccount>0){
            const deactivateToken = jwt.sign(
                {
                    userID:userId,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'1d'}
                );
            const sendInformEmail = await emailService.sendEmailAboutUserAccountDeactivate(userFullName,userEmail, deactivateToken);
            if(sendInformEmail){
                return res.status(201).json({message:"Send inform email"});
            }else{
                return res.status(500).json({message:"The email dosen't sended"});
            }
        }else{
            return res.status(500).json({message:"Something goes wrong"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error during updateUserData"});
    }
}

module.exports ={
    updateFullName,
    updatePassword,
    sendVerficationEmailsToUpdateEmail,
    updateUserData,
    deactivateAndSendCancelationEmail,
    getUserData
}