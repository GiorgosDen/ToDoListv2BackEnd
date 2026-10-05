/**User Controllers
 * Sign Up User
 * Change/Update User Data
 * Delete User
 */
const bcrypt =  require('bcrypt');

//userModel
const userModel = require('../models/userModel');
const taskModel = require('../models/taskModel');


/**request body
 * {
 *  fullname: first last
 *  email: ...@gmail.com
 *  password: ******
 * }
*/

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
        //Create new record
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
            return res.status(201).json({message:`Success deregitered user with id:${userId}`});
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
    updateUserData,
    deregisteredUser,
    getUserData
}