const express = require('express');
const router = express.Router();

//Controller
const auth = require('../controllers/authController');

router.get('/verify/:token',auth.completedSignUp);
router.post('/login',auth.authController);
router.post('/signUp',auth.sendVerficationEmail);
router.post('/reverify',auth.resendVerificationEmail);
router.post('/reset-pass-mail',auth.sendResetPasswordEmail);
router.post('reset-password/:token',auth.resetAccountPassword);
router.post('/logout',auth.logOutUser);
//verify the new email  
router.get('/email/:token',auth.updateEmailAfterVerification);
//cancel new email verification 
router.get('/cancel-email/:token',auth.cancelUpdateEmailVerification);
//reactivate user account
router.get('/reactive/:token',auth.reactivateUserAccount);

module.exports = router;