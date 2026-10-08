const express =  require('express');
const router = express.Router();

const userContoller =  require('../controllers/userController');
//middleware
const verifyAccessToken = require('../middleware/verifyAccessToken');
//Get user data
router.get('/',userContoller.getUserData);
//Send verification mails
router.post('/update-email',verifyAccessToken,userContoller.sendVerficationEmailsToUpdateEmail);
router.post('/deactivate-email',verifyAccessToken,userContoller.deactivateAndSendCancelationEmail);
//Update user data
router.patch('/fullname',verifyAccessToken,userContoller.updateFullName);
router.patch('/password',verifyAccessToken,userContoller.updatePassword);
router.put('/',verifyAccessToken,userContoller.updateUserData);
//Deregistered user
router.delete('/',verifyAccessToken,userContoller.deregisteredUser);

module.exports = router;