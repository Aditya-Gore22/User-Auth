const jwt = require('jsonwebtoken');
const logger=require('../utils/logger');

require('dotenv').config()


exports.protectedRoute=(req, res, next) =>{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    logger.error({message:'Access denied. No token provided.',method: req.method, url:`${req.protocol}://${req.get('host')}${req.originalUrl}`})
    return res.status(200).json({ status:false, message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.', error:err.message });
  }
}

