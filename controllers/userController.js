/**User Controllers
 * Sign Up User
 * Change/Update User Data
 * Delete User
 */
const bcrypt =  require('bcrypt');
const dbCon = require('../config/db');
//userModel
const userModel = require('../models/userModel');


/**request body
 * {
 *  fullname: first last
 *  email: ...@gmail.com
 *  password: ******
 * }
*/
const signUp = async (req,res)=>{
    try {
        //Hash the password 
        const salt = 10;
        const hashPassword = await bcrypt.hash(req.body.password,salt);
        //Create new record
        const affectedTableRows = await userModel.createUser(req.body.fullName,req.body.email,hashPassword);
        //Check record
        if(affectedTableRows===1){
            res.status(201).json({message:"A new User Signs Up"});
        }else{
            //Conflict 
            res.status(409).json({message:"Email is already used"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
}

module.exports ={
    signUp
}