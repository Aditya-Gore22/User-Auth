const uuid=require('uuid')
const {passwordHash}=require('../utils/passwordHash')
const {readUsers,writeUser}=require("../models/userModel")
const generateToken=require('../utils/generateToken')
const bcrypt=require('bcrypt')
const crypto=require('crypto')
const logger=require('../utils/logger')



exports.registerUser=async(req,res)=>{
    try{
        let {name,userName,email,pass}=req.body;
        if(!name || !userName || !email)
            return res.status(200).json({status:false,message:'All fields are required.'});
        const data=await readUsers()
        if(!pass)
        {
            pass=crypto.randomBytes(6).toString('base64').slice(0,6)
            console.log("pass",pass)
        }
        //Email Exists or not 
        const userExist=data.find(user=>user.email===email)
        if(userExist){
            logger.warn({message:'Email already registered.',method: req.method, url:`${req.protocol}://${req.get('host')}${req.originalUrl}`})
            return res.status(200).json({status:false,message:'Email already registered.' })
        }

        //User Name Exist or not 
        const userNameExist=data.find(user=>user.userName===userName)
        if(userNameExist){
            logger.warn({message:'Username already registered.',method: req.method, url:`${req.protocol}://${req.get('host')}${req.originalUrl}`})
            return res.status(200).json({status:false,message:'Username already registered.'})
        }

        
        const id=uuid.v7()
        const hashPassword=await passwordHash(pass)
        const newUser={
            id,
            name,
            userName,
            email,
            password : hashPassword,
            createdAt:new Date().toISOString(),
            updatedAt:new Date().toISOString(),
            isActive:true,
            isDeleted:false,
            deletedAt: null
        }
        data.push(newUser)
        await writeUser(data)
        // const token=generateToken.generateToken(newUser.id, newUser.email)
        // res.cookie("token",token)
        res.status(201).json({status:true,message:"User Registered successfully.", id:id})
    }
    catch(err)
    {
        logger.error({message:"Server error", error:err.message,method: req.method, url:`${req.protocol}://${req.get('host')}${req.originalUrl}`})
        res.status(500).json({sttus:false,message:"Server error", error:err.message })
    }
}



exports.loginUser=async(req,res)=>{
    try{ 
        const {email,pass}=req.body;
        if( !email || !pass)
                return res.status(200).json({status:false,message:'All fields are required.'});
        const data=await readUsers()
        const user = data.find(u => u.email === email);

        if (!user) {
        return res.status(200).json({status:false, message: "Invalid username or password" });
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
        return res.status(200).json({status:false, message: "Invalid username or password" });
        }
        const token = generateToken.generateToken(user.id, user.email)
        res.cookie("token",token) 
        res.status(201).json({status:true,message:'Logged in successfully.', id:user.id, token:token})
    }
    catch(err)
    {   
        logger.error({message:"Server error", error:err.message,method: req.method, url:`${req.protocol}://${req.get('host')}${req.originalUrl}`})
        res.status(500).json({message:"Server error", error:err.message })
    }

}

exports.logoutUser=(req,res)=>{
    res.clearCookie('token')
    res.json({status:true, message:'Logged out successfully.'})
}