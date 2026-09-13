const taskPriorityModel = require("../models/taskPriorityModel");


const getTaskPriorities = async (req,res)=>{
    try {
        const taskPriorities = await taskPriorityModel.getTaskPriorities();
        res.status(200).json(taskPriorities);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
}

module.exports={
    getTaskPriorities
}