require('dotenv').config();
const app = require('./app');
const dbConnection = require('./config/db');
const http = require('http');
const {Server} = require('socket.io');
const port = process.env.PORT || 3000;

const taskSceduler = require('./services/taskScheduler');

//Create HTTP1 server
const serverHTTP1 = http.createServer(app);
const io = new Server(serverHTTP1,{ cors: { origin: "*" } });
//Start the app, after checking db connection
const startServer = async ()=>{
    try {
        //Check if db connection works
        await dbConnection.query('SELECT 1');
        taskSceduler.expiredTaskControllSceduler(io);
        serverHTTP1.listen(port, ()=>{
            console.log(`Server running in PORT: ${port}`);
        });
    } catch (error) {
        console.log('Failed db connection: ', error.message);
    }
}

startServer();