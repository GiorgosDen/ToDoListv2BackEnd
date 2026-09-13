const express = require('express');
const cors = require('cors');
const app = express();

//import cors options
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
//import middleware
const verifyAccessToken = require('./middleware/verifyAccessToken');
//import routers
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const taskRouter = require('./routes/taskRouter');
const taskCategoryRouter = require('./routes/taskCategoryRouter');
const taskPriorityRouter = require('./routes/taskPriorityRoute');

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use('/auth',authRouter);
//Middleware
app.use(verifyAccessToken);
app.use('/user',userRouter);
app.use('/tasks',taskRouter);
app.use('/taskCategories',taskCategoryRouter);
app.use('/priority',taskPriorityRouter);

module.exports = app;