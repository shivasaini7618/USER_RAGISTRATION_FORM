const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');


passport.use(new localStrategy(async(username , password , done)=>{
  // authentication logic
  try{
    console.log('Received Credentials');
    const user = await User.findOne({username: username});
    if(!user){
      return done(null , false ,{ message:'Incorrect username'});
    }
    const isPasswordMatch =await user.comparePassword(password);
    if(isPasswordMatch ){
      return done (null , user);
    }else{
      return done(null , false , {message : 'Incorrect password'});
    }

  }catch(err){
    return done (err)
  }

}));
module.exports = passport;