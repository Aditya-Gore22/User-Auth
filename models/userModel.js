
const fs=require('fs').promises


async function readUsers() {
    try{
        const user=await fs.readFile("./user.json","utf-8")
        return JSON.parse(user);
    }
    catch(err)
    {
        throw(err)
    }
    
}

async function writeUser(user) {
    await fs.writeFile ("./user.json",JSON.stringify(user,null,2))
}

module.exports ={readUsers,writeUser}

