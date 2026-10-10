const cron = require('node-cron');

const userModel = require('../models/userModel');

const deleteInactiveAccountsControllSceduler = (io)=>{
    cron.schedule("* * * * *", async()=>{
        try {
            const affectedUserAccounts = await userModel.deleteInactiveAccounts();
            //console.log("Sceduler runs once");
            if(affectedUserAccounts){
                console.log("Delete inactive accounts");
            }
        } catch (error) {
            console.log(error);
        }
    });
}

module.exports = {
    deleteInactiveAccountsControllSceduler
}