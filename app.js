const express = require('express');
const cors = require('cors');
const app = express();

//import cors options
const corsOptions = require('./config/corsOptions');
//import middleware
const verifyAccessToken = require('./middleware/verifyAccessToken');
//import routers
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const taskRouter = require('./routes/taskRouter');

app.use(cors(corsOptions));
app.use(express.json());
app.use('/login',authRouter);
//Middleware
app.use(verifyAccessToken);
app.use('/user',userRouter);
app.use('/tasks',taskRouter);

module.exports = app;