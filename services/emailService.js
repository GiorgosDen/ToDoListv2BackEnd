const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Create mail transporter (use Brevo's free plan)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: process.env.SMTP_PORT, 
    secure: false,               // false for specific brevo port
    auth: {
        user: process.env.SMTP_NAME, 
        pass: process.env.SMTP_KEY  
    }
});

//Pass the userID into the token
//And sends a email (in <email> address) with verification link [apiCallURL/{token}]
//Return: True or False
const sendVerificationEmail = async(newUserID,fullName,email)=>{
    try {
        const verifyToken = jwt.sign(
            {userID:newUserID},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'15m'}
        );
        const mailConfig = {
            from: process.env.SMTP_PERSONAL_NAME,
            to: email,
            subject: 'Email Verification (ToDoListApp v2)',
            html: `Hi ${fullName}! <br><br>
                Thanks for signing up for ToDoListApp v2! Please click the link below to verify your email address and activate your account: <br>
                <a href="${process.env.BACK_URL}/auth/verify/${verifyToken}">Verify My Email</a><br><br>
                This link will expire in 15 minutes. If you didn't create an account with us, you can safely ignore this email.<br><br>
                Best regards, <br> 
                The ToDoListApp Team`
        };
        const info = await transporter.sendMail(mailConfig); 
        console.log(`Send verification email. Details:${info.messageId}`);
        return true; 
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

//Pass the userID & new email into the token
//And sends a email (in <email> address) with verification link [apiCallURL/{token}]
//Return: True or False
const sendVerificationEmailtoUpdate = async(fullName,newEmail,verifyToken)=>{
    try {
        if(!verifyToken){
            return false;
        }
        const mailConfig = {
            from: process.env.SMTP_PERSONAL_NAME,
            to: newEmail,
            subject: 'Email Update Verification (ToDoListApp v2)',
            html: `Hi ${fullName}! <br><br>
               Thanks for using ToDoListApp v2! Please click the link below to verify your new email address: <br>
                <a href="${process.env.BACK_URL}/auth/email/${verifyToken}">Verify My New Email</a><br><br>
                This link will expire in 15 minutes. If you don't want to update your account email, you can safely ignore this email.<br><br>
                Best regards, <br> 
                The ToDoListApp Team`
        };
        const info = await transporter.sendMail(mailConfig); 
        console.log(`Send verification email. Details:${info.messageId}`);
        return true; 
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

//Pass the user ID into the token
//And sends a email (in <email> address) to old email 
//Return: True or False
const sendVerificationEmailtoInform = async(fullName,oldEmail,newEmail, verifyToken)=>{
    try {
        if(!verifyToken){
            return false;
        }
        const mailConfig = {
            from: process.env.SMTP_PERSONAL_NAME,
            to: oldEmail,
            subject: 'Email Update Information (ToDoListApp v2)',
            html: `Hi ${fullName}! <br><br>
               Thanks for using ToDoListApp v2! You received an email to verify your account email update to &lt;${newEmail}&gt;. If you don't wish to update your email, please click the link below to cancel. <br>
                <a href="${process.env.BACK_URL}/auth/cancel-email/${verifyToken}">Cancel New Email Verification</a><br><br>
                This link will expire in 15 minutes. If you want to update your account email, you can safely ignore this email.<br><br>
                Best regards, <br> 
                The ToDoListApp Team`
        };
        const info = await transporter.sendMail(mailConfig); 
        console.log(`Send information email. Details:${info.messageId}`);
        return true; 
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

//Return: True or False
const sendEmailAboutUserAccountDeactivate = async(fullName, email, verifyToken)=>{
    try {
        if(!verifyToken){
            return false;
        }
        const mailConfig = {
            from: process.env.SMTP_PERSONAL_NAME,
            to: email,
            subject: 'Deactivate Your Account (ToDoListApp v2)',
            html: `Hi ${fullName}! <br><br>
               Thanks for using ToDoListApp v2! Your account has been deactivated after your request to deregister. If you don't wish to delete your account, please click the link below to reactivate it. <br>
                <a href="${process.env.BACK_URL}/auth/reactive/${verifyToken}">Activate my Account</a><br><br>
                This link will expire in 24 hours. After that, your account, along with all associated data (email, password, full name, tasks, and custom task categories), will be deleted from our systems. <br><br>
                Best regards, <br> 
                The ToDoListApp Team`
        };
        const info = await transporter.sendMail(mailConfig); 
        console.log(`Send information email. Details:${info.messageId}`);
        return true; 
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    sendVerificationEmail,
    sendVerificationEmailtoUpdate,
    sendVerificationEmailtoInform,
    sendEmailAboutUserAccountDeactivate
};