const express = require('express');
const app = express.Router();

const verifyJWT = require('../middleware/verifyAccessToken');
const taskCategoryController = require('../controllers/taskCategoryController');

app.get('/',verifyJWT,taskCategoryController.getTaskCategories);
app.post('/',verifyJWT,taskCategoryController.createTaskCategory);
app.put('/:id',verifyJWT,taskCategoryController.updateTaskCategory);
app.delete('/:id',verifyJWT,taskCategoryController.deleteTaskCategory);

module.exports= app;