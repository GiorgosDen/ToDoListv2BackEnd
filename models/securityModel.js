const dbCon = require('../config/db');

const securityModel ={
    async addNewSuspiciousRecord(userID,email,event){
        const timestampInSeconds = Math.floor(Date.now() / 1000);
        const query = "INSERT INTO suspiciouslog (`AssociateUser`,`DateTime`,`SuspiciousEmail`,`Event`) VALUES (?,?,?,?);";
        const [result] = await dbCon.query(query,[userID,timestampInSeconds,email,event]);
        if(result.affectedRows>0){
            return true;
        }
        return false;
    },
    async isForBlackListEmail(email){
        //Returns true if found 3+ attemps (recotds in suspiciouslog table)
        const query = "SELECT COUNT(*) AS attempts FROM suspiciouslog WHERE SuspiciousEmail=?;";
        const [result] = await dbCon.query(query,[email]);
        const count = result[0].attempts;
        if(count>=3)return true;
        return false;
    },
    async isInBlackList(email){
        //Returns true if found the email into blacklist table
        const query = "SELECT COUNT(*) AS records FROM balcklist WHERE Email=?;";
        const [result] = await dbCon.query(query,[email]);
        const count = result[0].records;
        if(count>=1)return true;
        return false;
    },
    async addNewEmailInBlackList(email){
        //-1: Fail to add new blacklist record
        //1: Success
        //0: Email is not for blacklist
        const isForBlackList = await this.isForBlackListEmail(email);
        if(isForBlackList){
            const query = "INSERT INTO blacklist (`Email`) VALUES (?);";
            const [result] = await dbCon.query(query,[email]);
            if(result.affectedRows>0){
                return 1;
            }
            return -1;
        }else{
            return 0;
        }
    }
}

module.exports = securityModel;