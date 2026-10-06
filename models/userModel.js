const dbCon =  require('../config/db');

const userModel = {
    async findEmailAvailiability(userEmail){
        const query = "SELECT * FROM user WHERE email=?;";
        const [users] = await dbCon.query(query,[userEmail]);
        if(users[0])return false;
        return true;
    },
    async findByEmail(userEmail){
        const query = "SELECT * FROM user WHERE email=? AND verified=1;";
        const [users] = await dbCon.query(query,[userEmail]);
        //console.log(users[0]);
        return users[0];//A JSON with user's data or a undefined
    },
    //Find the unverified user by id (for verified account)
    async findUnverifiedByID(userID){
        const query = "SELECT * FROM user WHERE id=? AND verified=0;";
        const [users] = await dbCon.query(query,[userID]);
        //console.log(users[0]);
        return users[0];//A JSON with user's data or a undefined
    },
    //Find the user by id (for updating data)
    async findByID(userID){
        const query = "SELECT * FROM user WHERE id=? AND verified=1;";
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
            return result.insertId;//Get new user id
        }
        return 0;//If the email is not availiable
    },
    //Verify user with by ID
    async verifyUserByID(userID){
        const existedUser =  await this.findUnverifiedByID(userID);
        if(existedUser){
            const query = "UPDATE user SET verified=1 WHERE id=?;";
            const [result] = await dbCon.query(query,[userID]);
            return result.affectedRows;
        }   
        return 0;
    },
    //Get user's data
    async getUserDataByID(userID){
        //find the user 
        const existedUser =  await this.findByID(userID);
        return existedUser? existedUser:[];
    },
    //Updates non sensitive data
    async updateUserFullName(fullName, userID){
        const existedUser = await this.getUserDataByID(userID);
        if(!existedUser){
            return 0;
        }
        if(fullName && fullName!=''){
            const query = 'UPDATE user SET fullName=? WHERE id=?;';
            const [result] = await dbCon.query(query,[fullName,userID]);
            return result.affectedRows;
        }
    },
    //Updates Password
    async updateUserPassword(password, userID){
        const existedUser = await this.getUserDataByID(userID);
        if(!existedUser){
            return 0;
        }
        if(password && password!=''){
            const query = 'UPDATE user SET password=? WHERE id=?;';
            const [result] = await dbCon.query(query,[fullName,userID]);
            return result.affectedRows;
        }
    },
    //update user email
    async upadateUserEmail(userID,userEmail){
        const existedUser = await this.getUserDataByID(userID);
        if(!existedUser){
            return 0;
        }
        if(userEmail){
            const query = 'UPDATE user SET email=? WHERE id=?;';
            const [result] = await dbCon.query(query,[userEmail,userID]);
            return result.affectedRows;
        }
    },
    //Update user data
    async updateUser(fullName,email,hashPassword,userID){
        //check if user with this id exists and take the data
        const existedUser = await this.getUserDataByID(userID);
        if(!existedUser){
            return 0;//If user not found
        }
        if(email && email==existedUser.email){
            return -1;//unavailiable email
        }
        
        const fields = [];
        const variables = [];

        if(fullName!==""){
            fields.push("fullName=?");
            variables.push(fullName);
        }
        if(email!=""){
            fields.push("email=?");
            variables.push(email);
        }
        if(hashPassword!=""){
            fields.push("password=?");
            variables.push(hashPassword);
        }
        variables.push(userID);
        const query = `UPDATE user SET ${fields.join(", ")} WHERE id=?;`;
        const [rows] = await dbCon.query(query,variables);
        return rows.affectedRows;
            
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