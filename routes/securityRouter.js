//Keeps suspicious logs and handle blacklist emails
const express = require('express');
const router = express.Router();

const securityController = require('../controllers/securityController');
const verifyAccessToken = require('../middleware/verifyAccessToken');

router.get('/record',verifyAccessToken,securityController.addNewRecord);
router.get('/blacklist',verifyAccessToken,securityController.addNewBlackListEmail);

module.exports=router;