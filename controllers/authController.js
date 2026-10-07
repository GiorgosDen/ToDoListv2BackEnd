const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//userModel
const userModel =  require('../models/userModel');
//service
const emailService = require('../services/emailService');

const authController = async (req,res)=>{
    try {
        const {importedEmail, importedPassword} = req.body;
        //console.log("Login imported data: ");
        //console.log(req.body);
        //Get the user by email
        const logedUser = await userModel.findByEmail(importedEmail); //JSON with user Data or undefined
        if(!logedUser){
            return res.status(404).json({message:"User with this email doesn't found"});
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
        //Check if email already used
        const emailAvailiable = await userModel.findEmailAvailiability(email);
        if(!emailAvailiable){
            return res.status(409).json({message:"The email already used"});
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

//Verify the new user (uses url token to gets the user ID)
const completedSignUp = async(req,res)=>{
    try {
        const token = req.params.token;
        const decodes = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userID = decodes.userID;
        const affectedRows = await userModel.verifyUserByID(Number(userID));
        if(affectedRows>0){
            return res.redirect(process.env.FRONT_URL);
        }else {
            return res.status(404).json({ message: `User [${userID} | ${affectedRows}] not found or already verified.` });
        }
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: "Verification link is invalid or has expired." });
        }
        return res.status(500).json({message:"server error"})
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
            return res.status(403).json({ message: "Token not found" });
        }
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

module.exports = {
    authController,
    sendVerficationEmail,
    completedSignUp,
    logOutUser,
    updateEmailAfterVerification
};