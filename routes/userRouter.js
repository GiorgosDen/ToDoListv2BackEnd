const express =  require('express');
const router = express.Router();

const userContoller =  require('../controllers/userController');

//Sign Up new user
router.post('/',userContoller.signUp);

module.exports = router;