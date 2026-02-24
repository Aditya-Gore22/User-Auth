const app=require('./app')

require('dotenv').config();
const PORT=process.env.PORT;


app.use((req,res)=>{
    res.json({message:'Route not found'})
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});