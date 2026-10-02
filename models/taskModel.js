const dbCon = require('../config/db');

const taskModel = {
    //Return all user tasks (with Category and Priority names)
    async getUserTasks(userID){
        const query = "SELECT t.*, c.Name as CatName, p.Name as PrName FROM task as t JOIN taskcategory as c JOIN taskpriority as p ON c.id=t.Category AND p.id=t.priority WHERE t.UserID=?;";
        const [tasks] = await dbCon.query(query,[userID]);
        //console.log(tasks);
        return tasks?tasks:[];
    },
    //Return daily User tasks
    async getDailyUserTasks(userID){
        const query = "SELECT t.*,c.Name as CatName, p.Name as PrName FROM task as t JOIN taskcategory as c JOIN taskpriority as p ON c.id=t.Category AND p.id=t.priority WHERE DateTime >= UNIX_TIMESTAMP(CURDATE()) AND DateTime < UNIX_TIMESTAMP(CURDATE() + INTERVAL 1 DAY) AND t.UserID=?;";
        const [tasks] = await dbCon.query(query,[userID]);
        //console.log(`Tasks From BACK: ${tasks}`);
        return tasks?tasks:[];
    },
    //Return weekly User tasks
    async getWeeklyUserTasks(userID){
        const query = "SELECT t.*, c.Name as CatName, p.Name as PrName FROM task as t JOIN taskcategory as c ON c.id = t.Category JOIN taskpriority as p ON p.id = t.priority WHERE FROM_UNIXTIME(t.DateTime) >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) AND FROM_UNIXTIME(t.DateTime) < DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY) AND UserID = ?;";
        const [tasks] = await dbCon.query(query,[userID]);
        return tasks?tasks:[];
    },
    //Return monthly User tasks
    async getMonthlyUserTasks(userID){
        const query = "SELECT t.*, c.Name as CatName, p.Name as PrName FROM task as t JOIN taskcategory as c ON c.id = t.Category JOIN taskpriority as p ON p.id = t.priority WHERE FROM_UNIXTIME(t.DateTime) >= DATE_FORMAT(CURDATE(), '%Y-%m-01') AND FROM_UNIXTIME(t.DateTime) < DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH) AND UserID = ?;";
        const [tasks] = await dbCon.query(query,[userID]);
        return tasks?tasks:[];
    },
    //Get All completed user tasks
    async getAllCompletedUserTasks(userID){
        const query = "SELECT t.*, c.Name as CatName, p.Name as PrName FROM task as t JOIN taskcategory as c JOIN taskpriority as p ON c.id=t.Category AND p.id=t.priority WHERE State=3 AND t.UserID=?;";
        const [tasks] = await dbCon.query(query,[userID]);
        return tasks?tasks:[];
    },
    //Get a Task data by ID
    async getTaskByID(taskID){
        const query = "SELECT t.*, c.Name as CatName, p.Name as PrName FROM task as t JOIN taskcategory as c JOIN taskpriority as p ON c.id=t.Category AND p.id=t.priority WHERE t.id=?;";
        const [task] = await dbCon.query(query,[taskID]);
        return task?task:[];
    },
    //create new task (taskData is a list)
    async createNewTask(userID,taskData){
        const {name,taskDescription,DateTime,category,state,priority,reminder,repeat} = taskData; //export tasks data
        const query = "INSERT INTO task (`Name`,`Description`,`DateTime`,`Category`,`State`,`Priority`,`Reminder`,`Repeat`,`UserID`) VALUES (?,?,?,?,?,?,?,?,?);"
        const [result] = await dbCon.query(query,[name,taskDescription,DateTime,category,state,priority,reminder,repeat,userID]);
        return result.affectedRows;
    },
    //delete a specific task
    async deleteTaskByID(taskID){
        //Check if task exists
        let query = "SELECT * FROM task WHERE id=?";
        const [task] = await dbCon.query(query,[taskID]);
        if(task){
            query = "DELETE FROM task WHERE id=?";
            const [result] = await dbCon.query(query,[taskID]);
            return result.affectedRows;
        }
        return 0;
    },
    //Delete all User Tasks
    async deleteUserTasks(userID){
        query = "DELETE FROM task WHERE userID=?";
        const [result] = await dbCon.query(query,[userID]);
        return result.affectedRows;
    },
    //Update task state as Completed
    async updateTaskStateByID(taskID){
        //Check if task exists and is not completed
        let query = "SELECT * FROM task WHERE id=? AND state!=3";
        const [task] = await dbCon.query(query,[taskID]);
        if(task){
            //State=3 means Completed
            query = "UPDATE todolist.task SET State = 3 WHERE id=?;";
            const [result] = await dbCon.query(query,[taskID]);
            return result.affectedRows;
        }
        return 0;
    },
    async updateExpiredTasks(){
        const query = "UPDATE task SET State=2 WHERE DateTime<UNIX_TIMESTAMP(now()) AND State!=3;";
        const [result] = await dbCon.query(query);
        return result.changedRows;//How many records had updated
    },
    async updateTaskInfobyID(taskID,userID,taskData){
        const {name,taskDescription,DateTime,category,state,priority,reminder,repeat} = taskData;
        //Check if task existed and is in Progress (state=1)
        let query = "SELECT * FROM task WHERE id=? AND State=1";
        const [row] = await dbCon.query(query,[taskID]);
        const task = row[0];
        if(task){
            query = "UPDATE task SET `Name`=?,`Description`=?,`DateTime`=?,`Category`=?,`State`=?,`Priority`=?,`Reminder`=?,`Repeat`=?,`UserID`=? WHERE `id`=?;";
            const [result] = await dbCon.query(query,[name,taskDescription,DateTime,category,state,priority,reminder,repeat,userID,taskID]);
            return result.affectedRows;
        }
        return 0;
    }
};

module.exports = taskModel;