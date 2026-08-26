require('dotenv').config();
const app = require('./app');
const dbConnection = require('./config/db');
const port = process.env.PORT || 3000;

//Start the app, after checking db connection
const startServer = async ()=>{
    try {
        //Check if db connection works
        await dbConnection.query('SELECT 1');
        app.listen(port, ()=>{
            console.log(`Server running in PORT: ${port}`);
        });
    } catch (error) {
        console.log('Failed db connection: ', error.message);
    }
}

startServer();