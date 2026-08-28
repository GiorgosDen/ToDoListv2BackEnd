const express =  require('express');
const router = express.Router();

const userContoller =  require('../controllers/userController');
//middleware
const verifyAccessToken = require('../middleware/verifyAccessToken');

//Sign Up new user
router.post('/',userContoller.signUp);
//Update user data
router.put('/',verifyAccessToken,userContoller.updateUserData);
//Deregistered user
router.delete('/',verifyAccessToken,userContoller.deregisteredUser);

module.exports = router;