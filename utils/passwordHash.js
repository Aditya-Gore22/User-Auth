const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.passwordHash=async(myPlaintextPassword)=>{
    try{
        const hash= await bcrypt.hash(myPlaintextPassword, saltRounds)
        return hash
    }
    catch(err)
    {
        throw(err)
    }

}

