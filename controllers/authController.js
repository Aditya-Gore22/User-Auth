const uuid=require('uuid')
const {passwordHash}=require('../utils/passwordHash')
const {readUsers,writeUser}=require("../models/userModel")
const generateToken=require('../utils/generateToken')
const bcrypt=require('bcrypt')
const logger=require('../utils/logger')

exports.registerUser=async(req,res)=>{
    try{
        const {name,userName,email,pass}=req.body;
        if(!name || !userName || !email || !pass)
            return res.status(400).json({message:'All fields are required.'});
        const data=await readUsers()
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
        const token=generateToken.generateToken(newUser.id, newUser.email)
        res.cookie("token",token)
        res.status(201).json({message:"User Registered successfully.", id:id, token:req.cookies.token})
    }
    catch(err)
    {
        logger.error({message:"Server error", error:err.message,method: req.method, url:`${req.protocol}://${req.get('host')}${req.originalUrl}`})
        res.status(500).json({message:"Server error", error:err.message })
    }
}



exports.loginUser=async(req,res)=>{
    try{ 
        const {email,pass}=req.body;
        if( !email || !pass)
                return res.status(400).json({message:'All fields are required.'});
        const data=await readUsers()
        const user = data.find(u => u.email === email);

        if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
        return res.status(400).json({ message: "Invalid username or password" });
        }
        const token = generateToken.generateToken(user.id, user.email)
        res.cookie("token",token) 
        res.status(201).json({message:'Logged in successfully.', id:user.id, token:req.cookies.token})
    }
    catch(err)
    {   
        logger.error({message:"Server error", error:err.message,method: req.method, url:`${req.protocol}://${req.get('host')}${req.originalUrl}`})
        res.status(500).json({message:"Server error", error:err.message })
    }

}

exports.logoutUser=(req,res)=>{
    res.clearCookie('token')
    res.json({message:'Logged out successfully.'})
}