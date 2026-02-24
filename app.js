const express=require('express')
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const logMiddleware = require('./middlewares/logMiddleware');
app.use(logMiddleware);


//Routes
const auth=require('./routes/authRoute')
app.use('/auth',auth)


const authMiddleware=require('./middlewares/authMiddleware')
app.get('/dashboard',authMiddleware.protectedRoute,(req,res)=>{
    res.send(`hello ${req.user.email}`)
})

app.get('/',(req,res)=>{
    res.send('hello')
})


module.exports=app;
