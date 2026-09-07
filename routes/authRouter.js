const express = require('express');
const router = express.Router();

//Controller
const auth = require('../controllers/authController');

router.get('/verify/:token',auth.completedSignUp);
router.post('/login',auth.authController);
router.post('/signUp',auth.sendVerficationEmail);
router.post('/logout',auth.logOutUser);

module.exports = router;