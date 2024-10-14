const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req , res , next)=>{

  // first check request headers has authorization or not 
  const authorization = req.headers.authorization;
  if(!authorization) return res.status(401).json({error: 'Token not found'});

  // extract the jwt token from the request headers 
  const token = req.headers.authorization.split(' ')[1];
  if(!token){
    return res.status(401).json({error: 'Unauthorized'});
  }

  try{
    // verify the jwt token 
    const decode = jwt.verify(token , process.env.JWT_SECRET);

    // attach user information to the request object
    req.user = decode;
    next();

  }catch(err){
    console.error(err);
    res.status(401).json({err: "Invalid token"});
  }
}

// Function to generate JWT token

const generateToken = (userData)=>{
  // generate a new jwt token using  user data 
  return jwt.sign(userData , process.env.JWT_SECRET );
}


module.exports = {jwtAuthMiddleware , generateToken};