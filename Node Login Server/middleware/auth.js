const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth = async (req, res, next ) => {
    try {

 const token = req.header('x-auth-token')
 if(!token)
 return res.status(401).json({message: "No Authenticaton token"})
    
const verified = jwt.verify(token, process.env.JWT_SECRET)
if(!verified)
return res.status(401).json({message: "Token is not verified"})

req.user = verified.id;
next();

    } catch (err){
        return res.status(400).json({error: err.message})
    }
};

module.exports = auth;