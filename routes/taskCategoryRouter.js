const express = require('express');
const app = express.Router();

const verifyJWT = require('../middleware/verifyAccessToken');
const taskCategoryController = require('../controllers/taskCategoryController');

app.get('/',verifyJWT,taskCategoryController.getTaskCategories);

module.exports= app;