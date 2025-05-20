const mongoose = require('mongoose');
require('dotenv').config();
const URL= process.env.MONGO_URI;

const db=async()=>{
    try {
        mongoose.connect(URL);
        console.log(`Connection established`)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports =db;