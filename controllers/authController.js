const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//userModel
const userModel =  require('../models/userModel');

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
        //let hashPass = await bcrypt.hash(logedUser.password,10);//Tha vgei otan apothikeutei o xristis me hashpassword
        const passwordMaches = await bcrypt.compare(importedPassword,password);
        if(passwordMaches){
           //Create user's access token
           const accessToken = jwt.sign(
                {userID: id},
                process.env.ACCESS_TOKEN_SECRET, 
                {expiresIn: "1h"}
            );
            //Send token and user name
            res.status(200).json({
                message:"User login success",
                accessToken,
                name:fullName
            })

        }else{
            res.status(401).json({message:"Invalid email or password"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};

module.exports = {authController};