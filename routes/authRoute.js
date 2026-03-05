const express=require('express')
const router=express.Router();
const authController=require('../controllers/authController')

//Registration

router.post('/register',authController.registerUser)
//Login
router.post('/login',authController.loginUser)

router.post('/logout',authController.logoutUser)


module.exports=router;