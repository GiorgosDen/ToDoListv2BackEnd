const dbCon = require('../config/db');
const userModel  = require('../models/userModel');

const taskCategoryModel ={
    async findCategoryByName(catName,userID){
        //Returns true/false if category exists
        const query = "SELECT * From taskcategory WHERE creatorID=? AND Name=?;";
        const result = await dbCon.query(query,[userID,catName]);
        return result[0]?true:false;
    },
    async findCategoryByID(catID,userID){
        //Returns true/false if category exists
        console.log(catID,userID);
        const query = "SELECT * From taskcategory WHERE creatorID=? AND id=?;";
        const result = await dbCon.query(query,[userID,catID]);
        return result[0].length>0?true:false;
    },
    //Get system's and user (if are exists) categories
    async getTaskCategories(userID){
        const query = "SELECT * FROM taskcategory WHERE creatorID IS NULL OR creatorID=?;";
        const results = await dbCon.query(query,[userID]);
        return results[0];
    },
    async createTaskCategory(userID,catData){
        //Input: userID categoryData (name, description, rgb code)
        const {name,description,colorRGB} = catData;
        const query = "INSERT INTO taskcategory (Name,Description,ColorRGB,creatorID) VALUES (?,?,?,?);";
        const results = await dbCon.query(query,[name,description,colorRGB,userID]);
        return results[0];
    },
    async deleteTaskCategory(catID){
        const query = "DELETE FROM taskcategory WHERE id=?;";
        const results = await dbCon.query(query,[catID]);
        return results[0];
    }
}

module.exports= taskCategoryModel;