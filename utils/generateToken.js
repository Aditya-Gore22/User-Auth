const jwt = require("jsonwebtoken");
require('dotenv').config()
exports.generateToken = (id,email) => {
  return jwt.sign({ email: email, id: id }, process.env.JWT_KEY,{expiresIn:"1h"});
}
