const taskPriorityModel = require("../models/taskPriorityModel");


const getTaskPriorities = async (req,res)=>{
    try {
        const taskPriorities = await taskPriorityModel.getTaskPriorities();
        return res.status(200).json(taskPriorities);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"});
    }
}

module.exports={
    getTaskPriorities
}