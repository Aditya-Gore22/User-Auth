const express=require('express')
const router=express.Router();

const authMiddleware=require('../middlewares/authMiddleware')
const authController=require('../controllers/authController')


const bodyParser = require('body-parser');
router.use(express.json());
router.use(express.urlencoded({extended:true}));
router.use(bodyParser.json());

//Registration

router.post('/register',authMiddleware.emailExists,authMiddleware.userNameExists,authController.registerUser)
//Login
router.post('/login',authController.loginUser)

router.post('/logout',authController.logoutUser)


module.exports=router;