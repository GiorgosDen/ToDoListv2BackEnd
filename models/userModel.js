const dbCon =  require('../config/db');

const userModel = {
    async findByEmail(userEmail){
        const query = "SELECT * FROM user WHERE email=?;";
        const [users] = await dbCon.query(query,[userEmail]);
        return users[0];//A JSON with user's data or a undefined
    },
    async createUser(fullName,email,hashPassword){
        //check if user with this email already exists
        const existedUser = this.findByEmail(email);
        if(!existedUser){
            //If doesn't exists
            const query = "INSERT INTO user (fullName,email,password) VALUES (?,?,?)";
            const [result] = await dbCon.query(query,[fullName,email,hashPassword]);
            return result.affectedRows;
        }
        return 0;//If the email is not availiable
    }
}

module.exports = userModel;