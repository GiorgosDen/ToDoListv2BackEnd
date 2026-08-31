const dbCon = require('../config/db');
const userModel  = require('../models/userModel');

const taskCategoryModel ={
    //Get system's and user (if are exists) categories
    async getTaskCategories(userID){
        const query = "SELECT * FROM taskcategory WHERE creatorID IS NULL OR creatorID=?;";
        const results = await dbCon.query(query,[userID]);
        return results[0];
    }
}

module.exports= taskCategoryModel;