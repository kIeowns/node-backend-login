const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const bodyParse = require('body-parser')
const connectDB = require('./config/db')



//Express Set up

const app = express();

//MiddleWare 
app.use(bodyParse.urlencoded({extended: false}))
app.use(bodyParse.json())

//Connect DB
connectDB();

//Set up Routes
app.use("/users", require('./routes/userRouter'));


//Port
const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server running on Port: ${port}`)
})

