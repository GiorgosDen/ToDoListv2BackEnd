const mysql = require('mysql2');
require('dotenv').config();

const dbPool = mysql.createPool({
    host:process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER,
    password:process.env.SERVER_PASSWORD,
    database:process.env.DATABASE_NAME,
    port:process.env.PORT || 3306,
    waitForConnections:true,
    ssl:{
        rejectUnauthorized: false
    },
    connectionLimit:10,
    queueLimit:0
}); 


module.exports = dbPool.promise();