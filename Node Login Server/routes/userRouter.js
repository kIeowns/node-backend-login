const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
require('dotenv').config()

router.post('/register', async (req,res) => {
    try{
let { username, email, password, passwordCheck} = req.body;

// Validate

if(!username || !email || !password || !passwordCheck)
    return res.status(400).json({msg: "Please fill in all the fields."});
if(password.length < 8)
return res.status(400).json({msg: "Password must be at least 8 characters"});
if(password !== passwordCheck)
return res.status(400).json({msg: "Please enter the same password twice."});

const existingUser = await User.findOne({email: email})
if(existingUser)
return res.status(400).json({msg: "This e-mail is already in use."})

if(!username) username = email;

const salt = await bcrypt.genSalt();
const passwordHash = await bcrypt.hash(password, salt)

const newUser = new User({
    username,
    email,
    password: passwordHash,
    
})

const savedUser = await newUser.save();
res.json(savedUser);

} catch (err) {
    res.status(500).json({error: err.message});
};
});

router.post("/login", async (req, res) => {
    try{
        const {email,  password} = req.body;

        //Validate
        if(!email || !password)
        return res.status(400).json({msg: "E-mail or Password is incorrect"});

        const user = await User.findOne({email: email})
        if(!user)
        return res.status(400).json({msg: "E-mail is not registered"})

         const isMatch = await bcrypt.compare(password, user.password)
         if(!isMatch)
         return res.status(400).json({msg: "Incorrect password."})

         const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
         res.json({
             token,
             user: {
                 id: user._id,
                 username: user,
                 email: user.email
             }
         })
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

router.delete('/delete', auth, async (req, res) => {
try{
    const deletedUser = await User.findByIdAndDelete(req.user)
    res.json(deletedUser)

} catch (err){
res.status(400).json({error: err.message})
}

})

router.post("/tokenIsValid", async (req,res) => {
    try{
        const token = req.header("x-auth-token")
        if(!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res.json(false)

        const user = await User.findById(verified.id)
        if (!user) return res.json(false);

        return res.json(true)

    }catch (err) {
        res.status(400).json({error: err.message})
    }
})

module.exports = router;