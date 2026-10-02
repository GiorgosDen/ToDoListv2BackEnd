const dbCon = require('../config/db');
const userModel  = require('../models/userModel');

const taskCategoryModel ={
    async findCategoryByName(userID,catName){
        //Returns true/false if category exists
        const query = "SELECT * From taskcategory WHERE (creatorID=? OR creatorID IS NULL) AND Name=?;";
        const result = await dbCon.query(query,[userID,catName]);
        //console.log(userID,catName,result[0].length>0,result[0].length>0?true:false);
        console.log(result[0]);
        return result[0].length>0?true:false;
    },
    async findCategoryByID(userID,catID){
        //Returns true/false if category exists
        const query = "SELECT * From taskcategory WHERE (creatorID=? OR creatorID IS NULL) AND id=?;";
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
    async updateTaskCategory(catID,catData){
        const {name,description,colorRGB} = catData;
        const query = "UPDATE taskcategory SET Name=? ,Description=? ,ColorRGB=? WHERE id=?;";
        const results = await dbCon.query(query,[name,description,colorRGB,catID]);
        return results[0];
    },
    async deleteTaskCategory(catID){
        const query = "DELETE FROM taskcategory WHERE id=?;";
        const results = await dbCon.query(query,[catID]);
        return results[0];
    },
    async handleDeletedCategoryTasks(catID){
        //Set tasks with Category=catID as Others (id=5)
        const query = "UPDATE task SET Category=5 WHERE Category=?;";
        const results = await dbCon.query(query,[catID]);
        return results[0];
    }
}

module.exports= taskCategoryModel;