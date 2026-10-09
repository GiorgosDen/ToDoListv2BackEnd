const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//userModel
const userModel =  require('../models/userModel');
//security model
const securityModel = require('../models/securityModel');
//service
const emailService = require('../services/emailService');

const authController = async (req,res)=>{
    try {
        const {importedEmail, importedPassword} = req.body;
        //Check ofr an unverified account
        const isInUnverifiedAccount = await userModel.isEmailInUnverifiedAccount(importedEmail);
        if(isInUnverifiedAccount){
            //Means that the user already tries to signup, but doesn't verify the account in 15 minutes
            //It needs to resend a verification email (an unverified account deleted after 48 hours)
            return res.status(423).json({message:"You already have an unverified account with this email"});
        }
        //Get the user by email
        const logedUser = await userModel.findByEmail(importedEmail); //JSON with user Data or undefined
        if(!logedUser){
            return res.status(404).json({message:"User with this email doesn't found"});
        }
        const isInBlackList = await securityModel.isInBlackListEmails(importedEmail);//If user's email is blacklist
        if(isInBlackList){
            return res.status(422).json({message:"Black List email"});
        }
        //console.log("Found this user");
        //console.log(logedUser);
        const {id,fullName,email,password} = logedUser;
        //Check the password 
        const passwordMaches = await bcrypt.compare(importedPassword,password);
        if(passwordMaches){
           //Create user's access token
           const accessToken = jwt.sign(
                {userID: id},
                process.env.ACCESS_TOKEN_SECRET, 
                {expiresIn: "1h"}
            );
            //Send token with cookie and user name as JSON
            return res.cookie("JWToken",accessToken,{
                httpOnly:true,
                secure:true,
                sameSite:'none'
            }).status(201).json({
                message:"User login success",
                name:fullName
            });

        }else{
            return res.status(401).json({message:"Invalid email or password"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"});
    }
};
//Send verification email to sign up
const sendVerficationEmail =async (req,res)=>{
    try {
        const {fullName,email, password} = req.body;
        //Check if email already is in unverified account
        const isInUnverifiedAccount = await userModel.isEmailInUnverifiedAccount(email);
        if(isInUnverifiedAccount){
            //Means that the user already tries to signup, but doesn't verify the account in 15 minutes
            //It needs to resend a verification email (an unverified account deleted after 48 hours)
            return res.status(423).json({message:"You already have an unverified account with this email"});
        }
        //Check if email already used in general 
        const emailAvailiable = await userModel.findEmailAvailiability(email);
        if(!emailAvailiable){
            return res.status(409).json({message:"The email already used"});
        }
        const isInBlackList = await securityModel.isInBlackListEmails(email);//If user's email is blacklist
        if(isInBlackList){
            return res.status(422).json({message:"Black List email"});
        }
        //Hash the password 
        const salt = 10;
        const hashPassword = await bcrypt.hash(password,salt);
        const newUserID = await userModel.createUser(fullName,email,hashPassword);
        if(newUserID>0){
            //Call Email service
            const sendEmail = await emailService.sendVerificationEmail(newUserID,fullName,email);
            if(!sendEmail){
                return res.status(500).json({message:"Create user but transport verification email failed"});
            }
            return res.status(201).json({message:"Send the verification email"});
        }else{
            return res.status(409).json({message:"This email already used"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error during sending ver email"});
    }

}

const resendVerificationEmail = async(req,res)=>{
    try {
        const unverifiedAccountEmail = req.body.email;
        const isInUnverifiedAccount = await userModel.isEmailInUnverifiedAccount(unverifiedAccountEmail);
        const emailAccount = await userModel.findByEmail(unverifiedAccountEmail);
        if(!isInUnverifiedAccount && !emailAccount){
            return res.status(404).json({message:"Email Not Found"});
        }else{
            //If account with this email exists and is unverified
            const accountID  = emailAccount.id;
            const fullName = emailAccount.fullName;
            //Call Email service
            const sendEmail = await emailService.reSendVerificationEmail(accountID,fullName,unverifiedAccountEmail);
            if(!sendEmail){
                return res.status(500).json({message:"Resend verification email failed"});
            }
            return res.status(201).json({message:"Resend the verification email"});
        } 
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error during sending ver email"});
    }
}

//Verify the new user (uses url token to gets the user ID)
const completedSignUp = async(req,res)=>{
    try {
        const token = req.params.token;
        const decodes = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userID = decodes.userID;
        const affectedRows = await userModel.verifyUserByID(Number(userID));
        if(affectedRows>0){
            return res.redirect(`${process.env.FRONT_URL}?status=200`);
        }else {
            return res.redirect(`${process.env.FRONT_URL}?status=404`);
        }
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.redirect(`${process.env.FRONT_URL}?status=403`);
        }
        return res.redirect(`${process.env.FRONT_URL}?status=500`);
    }
}
//Log Out (cleare cookie)
const logOutUser = async(req,res)=>{
    res.clearCookie('JWToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  }).send({ success: true });
}

const updateEmailAfterVerification= async(req,res)=>{
    try {
        const {token} = req.params;
        if(!token){
            return res.redirect(`${process.env.FRONT_URL}?status=403`);
        }
        const decodes = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userID = decodes.userID;
        const userEmail = decodes.userEmail;
        
        const affectedRows = await userModel.upadateUserEmail(userID,userEmail);
        if(affectedRows>0){
            return res.redirect(`${process.env.FRONT_URL}?status=200`);
        }else {
            return res.redirect(`${process.env.FRONT_URL}?status=404`);
        }
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.redirect(`${process.env.FRONT_URL}?status=403`);
        }
        return res.redirect(`${process.env.FRONT_URL}?status=500`);
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

const reactivateUserAccount= async(req,res)=>{
    try {
        const {token} = req.params;
        if(!token){
            return res.redirect(`${process.env.FRONT_URL}?status=403`);
        }
        const decodes = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userID = decodes.userID;
        
        const affectedRows = await userModel.activateUserAccount(userID);
        if(affectedRows>0){
            return res.redirect(`${process.env.FRONT_URL}?status=200`);
        }else {
            return res.redirect(`${process.env.FRONT_URL}?status=500`);
        }
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.redirect(`${process.env.FRONT_URL}?status=403`);
        }
        return res.redirect(`${process.env.FRONT_URL}?status=500`);
    }
}

module.exports = {
    authController,
    sendVerficationEmail,
    completedSignUp,
    logOutUser,
    updateEmailAfterVerification,
    cancelUpdateEmailVerification,
    reactivateUserAccount
};