const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI

//Setting MongoDB
const connectDB = async () => {
    try { await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
console.log('MongoDB Connected...')}
catch (err) {
    console.log(err.message)
    process.exit(1)
}
}

module.exports = connectDB;