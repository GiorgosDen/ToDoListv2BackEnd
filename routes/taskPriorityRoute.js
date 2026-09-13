const express = require('express');
const app = express.Router();

const verifyJWT = require('../middleware/verifyAccessToken');
const taskPriorityController = require('../controllers/taskPriorityController');

app.get('/',verifyJWT,taskPriorityController.getTaskPriorities);

module.exports= app;