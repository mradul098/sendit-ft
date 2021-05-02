require('dotenv').config();
const mongoose = require('mongoose');

function connectDB(){
    //database connection
    mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true}); //ye function export hoga tab url jo hai iske andar pass and userid hogi now ab ye secret credentials vunlerable ho jaynge if you upload it in github or somethig so we should save the things in a file and then upload it here for that we use the env , .env file create karo aur uske andar define karo sab and yes  "npm add dotenv"
    const connection = mongoose.connection;

    connection.once('open' ,()=>{
        console.log('database connected.');
    }).catch(err => {
        console.log('connection failed');
    });
}

module.exports = connectDB;