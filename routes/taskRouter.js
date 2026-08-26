const express = require('express');
const router = express.Router();

const verifyAccessToken = require('../middleware/verifyAccessToken');
const taskController = require('../controllers/taskController');

router.get('/',verifyAccessToken,taskController.getAllUserTasks);
router.post('/',verifyAccessToken,taskController.createNewTask);
router.delete('/:id',verifyAccessToken,taskController.deleteTaskByID);
router.patch('/',verifyAccessToken,taskController.updateExpiredTasks);
router.patch('/:id',verifyAccessToken,taskController.updateTaskStateByID);
router.put('/:id',verifyAccessToken,taskController.updateTaskInfobyID);

module.exports = router;