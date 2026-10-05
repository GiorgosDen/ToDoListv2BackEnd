const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Create mail transporter (pass the gmail address and 16-digit key)
const transporter = nodemailer.createTransport(
    {
        service:'gmail',
        auth:{
            user:process.env.SMTP_NAME,
            pass:process.env.SMTP_KEY
        }
    }
);

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
            from: process.env.SMTP_NAME,
            to: email,
            subject: 'Email Verification (ToDoListApp v2)',
            html:`Hi ${fullName}! <br>
                Thanks for signing up for ToDoListApp v2! Please click the link below to verify your email address and activate your account: ${process.env.BACK_URL}/auth/verify/${verifyToken}<br>
                This link will expire in 15 minutes. If you didn't create an account with us, you can safely ignore this email.<br>
                Best regards, 
                <br> The ToDoListApp Team`
        };
        const info = await transporter.sendMail(mailConfig); 
        console.log(`Send verification email. Details:${info.messageId}`);
        return true; 
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {sendVerificationEmail};