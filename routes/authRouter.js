const express = require('express');
const router = express.Router();

//Controller
const auth = require('../controllers/authController');

router.post('/',auth.authController);

module.exports = router;