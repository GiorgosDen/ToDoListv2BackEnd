const express = require('express');
const router = express.Router();

//Controller
const auth = require('../controllers/authController');

router.post('/',auth.authController);
router.post('/logout',auth.logOutUser);

module.exports = router;