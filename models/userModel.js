const dbCon =  require('../config/db');

const userModel = {
    async findByEmail(userEmail){
        const query = "SELECT * FROM user WHERE email=?;";
        const [users] = await dbCon.query(query,[userEmail]);
        //console.log(users[0]);
        return users[0];//A JSON with user's data or a undefined
    },
    //Find the user by id (for updating data)
    async findByID(userID){
        const query = "SELECT * FROM user WHERE id=?;";
        const [users] = await dbCon.query(query,[userID]);
        //console.log(users[0]);
        return users[0];//A JSON with user's data or a undefined
    },
    async createUser(fullName,email,hashPassword){
        //check if user with this email already exists
        const existedUser = await this.findByEmail(email);
        //console.log(!existedUser);
        if(!existedUser){
            //If doesn't exists
            const query = "INSERT INTO user (fullName,email,password) VALUES (?,?,?)";
            const [result] = await dbCon.query(query,[fullName,email,hashPassword]);
            return result.affectedRows;
        }
        return 0;//If the email is not availiable
    },
    //Get user's data
    async getUserDataByID(userID){
        //find the user 
        const existedUser =  await this.findByID(userID);
        return existedUser? existedUser:[];
    },
    //Update user data
    async updateUser(fullName,email,hashPassword,userID){
        //check if user with this id exists and take the data
        const existedUser = await this.getUserDataByID(userID);
        if(existedUser){
            //check if email is availiable (in case that user wants to update the email)
            const existedUserByEmail = await this.findByEmail(email);
            //if user wants update the email OR not
            //(email!=existedUser[2] && !existedUserByEmail) || (email==existedUser[2])
            if(!existedUserByEmail || email==existedUser[2]){
                //if user with id exist and the email is availiable
                const query = "UPDATE user SET fullName=? ,email=? ,password=? WHERE id=?";
                const [result] = await dbCon.query(query,[fullName,email,hashPassword,userID]);
                return result.affectedRows;
            }else 
                //The user wants update the email but the new email is not availiable
                return -1;
            }
            return 0;//If user not found
    },
    async deleteUser(userID){
        //Check if user exists
        let query = "SELECT * FROM user WHERE id=?;";
        const [user] = await dbCon.query(query,[userID]);
        if(user){
            //delete user
            query = "DELETE FROM user WHERE id=?;";
            const [rows] = await dbCon.query(query,[userID]);
            return rows.affectedRows;
        }
        //User not found
        return 0; 
    }
}

module.exports = userModel;