const jwt = require('jsonwebtoken');
const {readUsers}=require("../models/userModel")
const logger=require('../utils/logger');
const { error } = require('winston');
require('dotenv').config()


exports.emailExists=async (req,res,next) =>{
    const email=req.body.email
    const data=await readUsers()
        const userExist=data.find(user=>user.email===email)
        if(userExist){
            logger.error({message:'Email already registered.',method: req.method, url:`${req.protocol}://${req.get('host')}${req.originalUrl}`})
            return res.status(400).json({message:'Email already registered.'})
        }
        next()
}

exports.userNameExists=async (req,res,next)=> {
    const userName=req.body.userName
    const data=await readUsers()
    const userNameExist=data.find(user=>user.userName===userName)
    if(userNameExist){
      logger.error({message:'Username already registered.',method: req.method, url:`${req.protocol}://${req.get('host')}${req.originalUrl}`})
      return res.status(400).json({message:'Username already registered.'})
    }
    next()

}



exports.protectedRoute=(req, res, next) =>{
  const token =req.cookies.token;
  if (!token) {
    logger.error({message:'Access denied. No token provided.',method: req.method, url:`${req.protocol}://${req.get('host')}${req.originalUrl}`})
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.', error:err.message });
  }
}

