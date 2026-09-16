const categoryModel = require('../models/taskCategoryModel');

const getTaskCategories = async (req,res)=>{
    try {
        const userId = req.userID;
        const taskCategories = await categoryModel.getTaskCategories(userId);
        return res.status(200).json(taskCategories);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"});
    }
}

const createTaskCategory = async (req,res)=>{
    try {
        const userId = req.userID;
        const catData={
            name:req.body.Name,
            description:req.body.Description,
            colorRGB:req.body.colorRGB
        }
        const catExists = await categoryModel.findCategoryByName(userId,catData.name);
        if(!catExists){
            const result = await categoryModel.createTaskCategory(userId,catData);
            if(result){
                return res.status(200).json({message:"Create new Task Category"});
            }else{
                return res.status(400).json({message:"Fail create new Task Category"});
            }
        }else{
            return res.status(409).json({message:"The task already exists"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"});   
    }
}

const deleteTaskCategory = async (req,res)=>{
    try {
        const userId = req.userID;
        const catID = req.params.id;
        const isExists = await categoryModel.findCategoryByID(catID,userId);
        console.log(isExists);
        if(isExists){
            const result = await categoryModel.deleteTaskCategory(catID);
            if(result){
                return res.status(200).json({message:"Task Category Delete"});
            }else{
                return res.status(400).json({message:"Fail delete Task Category"});
            }
        }else{
            return res.status(404).json({message:"Task Category not Found"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"});   
    }
}
module.exports={
    getTaskCategories,
    createTaskCategory,
    deleteTaskCategory
}