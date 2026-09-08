const cron = require('node-cron');

const taskModel = require('../models/taskModel');

const expiredTaskControllSceduler = (io)=>{
    cron.schedule("* * * * *", async()=>{
        try {
            const affectedTasks = await taskModel.updateExpiredTasks();
            //console.log("Sceduler runs once");
            if(affectedTasks && io){
                io.emit('tasks-updated');
            }
        } catch (error) {
            console.log(error);
        }
    });
}

module.exports = {
    expiredTaskControllSceduler
}