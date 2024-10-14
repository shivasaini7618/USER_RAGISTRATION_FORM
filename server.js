const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const db = require('./config/db');
const userRoute = require('./routes/userRoute');
const passport = require ('./middleware/auth');

app.use(bodyParser.json());

const PORT = process.env.PORT || 4000

app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate('local' , {session:false});


app.use('/user' , userRoute);



app.get('/' , (req , res)=>{
  res.send('Welcome To Homepage');
});


app.listen(PORT , ()=>{
  console.log(`Server Started On ${PORT}`);
});