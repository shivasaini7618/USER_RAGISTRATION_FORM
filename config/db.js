const mongoose = require('mongoose');
require('dotenv').config();


const dbURL = process.env.MONGODB_URL

mongoose.connect(dbURL);

const db = mongoose.connection;

db.on('connected' , ()=>{
  console.log('Mongodb server connected');
});

db.on('disconnected' , ()=>{
  console.log('Mongodb server disconnected');
});

db.on('error' , (err)=>{
  console.log('Mongodb server error' , err)
});

module.exports = db;