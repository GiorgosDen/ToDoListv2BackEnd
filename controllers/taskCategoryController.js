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
            colorRGB:req.body.ColorRGB
        }
        const catExists = await categoryModel.findCategoryByName(userId,catData.name);
        if(!catExists){
            const result = await categoryModel.createTaskCategory(userId,catData);
            if(result){
                return res.status(200).json({message:"create-new-task-category"});
            }else{
                return res.status(400).json({message:"Fail create new Task Category"});
            }
        }else{
            return res.status(409).json({message:"The task category already exists"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"});   
    }
}

const updateTaskCategory = async(req,res)=>{
    try {
        const userId = req.userID;
        const catID = req.params.id;
        const catData={
            name:req.body.Name,
            description:req.body.Description,
            colorRGB:req.body.ColorRGB
        }
        const catExists = await categoryModel.findCategoryByName(userId,catData.name);
        if(catExists){
            const result = await categoryModel.updateTaskCategory(catID,catData);
            if(result){
                return res.status(200).json({message:"update-task-category"});
            }else{
                return res.status(400).json({message:"Fail while Update Task Category"});
            }
        }else{
            return res.status(404).json({message:"Category not Found"});
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
        const isExists = await categoryModel.findCategoryByID(userId,catID);
        if(isExists){
            const handleCategoryTasks = await categoryModel.handleDeletedCategoryTasks(catID);
            if(handleCategoryTasks){
                const result = await categoryModel.deleteTaskCategory(catID);
                if(result){
                    return res.status(200).json({message:"task-category-delete"});
                }else{
                    return res.status(400).json({message:"Fail delete Task Category"});
                }
            }else{
                return res.status(400).json(400).json({message:"Faild Handle Deleted Category Tasks (set the Category=5 (Others)"});
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
    updateTaskCategory,
    deleteTaskCategory
}