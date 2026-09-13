const dbCon = require('../config/db');

const taskPriorityModel ={
    //Get system's priorities
    async getTaskPriorities(){
        const query = "SELECT * FROM taskpriority;";
        const results = await dbCon.query(query);
        return results[0];
    }
}

module.exports = taskPriorityModel;