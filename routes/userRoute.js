const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const {jwtAuthMiddleware , generateToken} = require('../middleware/jwt.js');

// ragistration router
router.post('/ragistration' ,async(req , res)=>{
  try{
    // extract data from the body
    const data = req.body;
    // new user 
    const newUser = new User(data);
    // save data in new user
    const response = await newUser.save();
    console.log('data saved');
    const payload = {
      id:response.id,
      username:response.username
    }
    console.log(payload);
    const token = generateToken(payload);
    console.log('Token is : ',token);
    

    res.status(200).json(response);

  }catch(err){
    console.error(err);
    res.status(500).json({err: 'Internal server error'});
  }
} );

// login route
router.post('/login' , async(req , res)=>{
  try{
    // extract username and password from the body
  const {username , password} = req.body;
  const user = await User.findOne({username : username});
  const pwd = await User.findOne({password: password});
  if(!user || !pwd){
    return res.status(401).json({err: 'Invalid Username and password'});
  };

  // generate token 
  const payload = {
    id : user.id,
    username: user.username
  }
  const token =generateToken(payload);

  // return token as response 
  res.json({token});

  } catch(err){
    console.error(err);
    res.status(500).json({err:"Internal server error"});
  }
});

// profile routes

router.get('/:profile' , jwtAuthMiddleware, async(req , res)=>{
  try{
    const userData = req.body;
    console.log('user data ' , userData);

    const userId = userData.id;
    const user = await User.findById(userId);

    res.status(200).json(user);

  }catch(err){
    console.error(err);
    res.status(500).json({err:"Internal server error"});
    
  }
})

router.get('/' , jwtAuthMiddleware , async(req , res)=>{
  try{
    const data = await User.find();
    console.log('data fetched successfully ');
    res.status(200).json(data);

  }catch(err){
    console.log(err);
    res.status(500).json("Internal server error");
  }
});


// data fetched using gendar type
router.get('/:genderType' ,async(req , res)=>{
  try{
    // fetch gender type
    const genderType = req.params.genderType;
    if(genderType=='male' || genderType=='female'){
      const response = await User.find({gender:genderType});
      console.log('response fetched');
      res.status(200).json(response);
    } else{
      res.status(404).json({message:'Invalid gendar type'});
    }
  }catch(err){
    console.log(err);
    res.status(500).json('Internal server error');
  }
});

// update router 
router.put('/:id' , async(req , res)=>{
  try{
    const userId = req.params.id;
    const userUpdateData = req.body;

    const response = await User.findByIdAndUpdate(userId , userUpdateData);
    if(!userId){
      console.log('User not found');
      return res.status(404).json({error: 'User not found'});
    }
    console.log('User data  updated');
    res.status(200).json(response);
  }catch(err){
    console.error(err);
    res.status(500).json({err:'Internal server error'});
  }
});

// delete user router 
router.delete('/:id' ,async(req , res)=>{
 try{
  const userId = req.params.id;
  const response = await User.findByIdAndDelete(userId);
  if(!userId){
    console.log('User not found');
    return res.status(404).json({error: 'User not found'});
  }
  console.log('data deleted')
  res.status(200).json({message:"User deleted successfully"})
 }catch(err){
  console.error(err);
  res.status(500).json({err:'Internal server error'});
 }
});

module.exports = router;