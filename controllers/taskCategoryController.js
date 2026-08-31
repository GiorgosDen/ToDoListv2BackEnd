const categoryModel = require('../models/taskCategoryModel');

const getTaskCategories = async (req,res)=>{
    try {
        const userId = req.userID;
        const taskCategories = await categoryModel.getTaskCategories(userId);
        res.status(200).json(taskCategories);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
}

module.exports={
    getTaskCategories
}