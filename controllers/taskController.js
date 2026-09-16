const taskModel = require('../models/taskModel');


/**GET */
//Get all user tasks 
const getAllUserTasks = async (req,res)=>{
    try {
        const userID = req.userID;
        //console.log(userID);
        const userTasks = await taskModel.getUserTasks(userID);
        //console.log(userTasks);
        return res.status(200).json({userTasks});   
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
}
//Get daily tasks
const getDailyUserTasks = async (req,res)=>{
    try {
        const userID = req.userID;
        //console.log(userID);
        const userTasks = await taskModel.getDailyUserTasks(userID);
        //console.log(userTasks);
        return res.status(200).json({userTasks});   
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
}
//Get Weekly tasks
const getWeeklyUserTasks = async (req,res)=>{
    try {
        const userID = req.userID;
        //console.log(userID);
        const userTasks = await taskModel.getWeeklyUserTasks(userID);
        //console.log(userTasks);
        return res.status(200).json({userTasks});   
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
}
//Get Monthly tasks
const getMonthlyUserTasks = async (req,res)=>{
    try {
        const userID = req.userID;
        //console.log(userID);
        const userTasks = await taskModel.getMonthlyUserTasks(userID);
        //console.log(userTasks);
        return res.status(200).json({userTasks});   
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
}

const getTaskByID = async(req,res)=>{
    try {
        const taskId = req.params.id;
        const userTask = await taskModel.getTaskByID(taskId);
        return res.status(200).json({userTask});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error (getTaskByID"});
    }
}

//Get All completed user tasks
const getCompletedUserTasks= async(req,res)=>{
    try {
        const userID = req.userID;
        const userTasks = await taskModel.getAllCompletedUserTasks(userID);
        return res.status(200).json({userTasks});  
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error (while getting completed tasks"});
    }
}
/**POST */
const createNewTask = async(req,res)=>{
    try {
        //Get a req.body with tasks Data
        const taskData = req.body; //taskData as JSON object
        const userID = req.userID;
        const affectedRows = await taskModel.createNewTask(userID,taskData);
        if(affectedRows===1){
            // If create a new record for new task
            return res.status(200).json({message:"Create new task"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
}

/**DELETE */
const deleteTaskByID = async(req,res)=>{
    try {
        const taskID = req.params.id;
        //console.log("Task id that will be deleted");
        //console.log(taskID);
        const affectedRows = await taskModel.deleteTaskByID(taskID);
        if(affectedRows===1){
            // If delete the task
            return res.status(200).json({message:`Delete the task with ID:${taskID}`});
        }else{
            //The model sends 0 because cann;t find the task
            return res.status(404).json({message:`Task with id=${taskID} not found`});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
}

/**PATCH */
const updateTaskStateByID = async(req,res)=>{
    //When a user sets a task as completed in main page
    try {
        const taskID = req.params.id;
        const affectedRows = await taskModel.updateTaskStateByID(taskID);
        if(affectedRows===1){
            // If Update task state
            return res.status(200).json({message:`Set completed the task with ID:${taskID}`});
        }else{
            return res.status(404).json({message:`Task with id=${taskID} not found`});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }

}

const updateExpiredTasks = async(req,res)=>{
    //Checks for expired tasks and updates the states
    try {
        const affectedRows = await taskModel.updateExpiredTasks();
        return res.status(200).json({message:`${affectedRows} tasks expired`});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
}

/**UPDATE */
const updateTaskInfobyID = async (req,res)=>{
    try {
        const taskID = req.params.id;
        const userID = req.userID;
        const taskData = req.body;
        console.log(`Task ID:${taskID},User ID${userID}`);
        const affectedRows = await taskModel.updateTaskInfobyID(taskID,userID,taskData);
        if(affectedRows===1){
            // If update task data
            return res.status(200).json({message:`Update task with ID:${taskID}`});
        }else{
            return res.status(403).json({message:"Forbidden Task (Is not exists or Is not in Progress"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
}

module.exports ={
    getAllUserTasks,
    getDailyUserTasks,
    getWeeklyUserTasks,
    getMonthlyUserTasks,
    getTaskByID,
    getCompletedUserTasks,
    createNewTask,
    deleteTaskByID,
    updateTaskStateByID,
    updateExpiredTasks,
    updateTaskInfobyID
};