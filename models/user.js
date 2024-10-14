const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName:{
    type:String , 
    required: true
  },
  lastName:{
    type:String , 
    required: true
  },
  mobile:{
    type:String,
    required:true,
    unique:true
  },
  gmail:{
    type:String,
    required:true,
    unique:true
  },
  age:{
    type:Number,
    required:true
  },
  gender:{
    type:String,
    enum:['male' , 'female']
  }, 
  address:{
    type:String,
  }, 
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  }
});
userSchema.pre('save' , async function (next){
  const user = this;
  // hash the password only if it has been modified (or is new)
  if(!user.isModified('password')) return next();
  try{
    // hash password generation
    const salt = await bcrypt.genSalt(10);

    // hashed password 
    const hashedUser = await bcrypt.hash(user.password , salt);

    user.password = hashedPassword;
    next();
  }catch(err){
    return next(err);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword){
  try{
    const isMatch = await bcrypt.compare(candidatePassword , this.password);
    return isMatch;
  }catch(err){
    throw err;
  }
}


const User = mongoose.model('User' , userSchema);
module.exports = User;