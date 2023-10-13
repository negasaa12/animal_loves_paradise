
//import necessary dependencies 

const jwt = require("jsonwebtoken")
const { SECRET_KEY} = require("./config");
const ExpressError = require("./expressError");


function logger(req,res,next){
    console.log("RECEIVED")
    return next();
};


//authenticate JWT token
function authenticateJWT(req, res, next) {
    try { 
      
      const token = req.body.token;
      
      if (!token || null) {
        
      
        // Token is missing, return an error response
        return res.status(401).json({ error: "Unauthorized!" });
      }
  
      // Verify the token using the SECRET_KEY
      const payload = jwt.verify(token, SECRET_KEY);
  
      // Attach the user information to the request
      req.user = payload;
      // Continue to the next middleware or route handler
      console.log("YOU HAVE A VALID TOKEN",req.user);
      console.log("User object in authenticate middleware:", req.body.token, req.body);
      return next();
    } catch (e) {
      console.error('JWT verification failed:', e);
      return next();
    }
  }
  
  //authenticate JWT token in req.query
function authenticateJWTQuery(req, res, next) {
  try { 
    
    const token = req.query.token;
    
    if (!token || null) {
      
    
      // Token is missing, return an error response
      return res.status(401).json({ error: "Unauthorized!" });
    }

    // Verify the token using the SECRET_KEY
    const payload = jwt.verify(token, SECRET_KEY);

    // Attach the user information to the request
    req.user = payload;
    // Continue to the next middleware or route handler
    
    return next();
  } catch (e) {
    console.error('JWT verification failed:', e);
    return next();
  }
}
  //ensure user is logged in by checking the user object in the req.body
  const ensuredLoggedIn = (req, res, next) => {
    try {
      // Add debugging statements to check the user object
      
      
      if (!req.body.user) {
        const e = new ExpressError("Unauthorized", 401);
        return next(e);
      } else {
        return next();
      }
    } catch (e) {
      return next(e);
    }
  };

   //ensure user is logged in by checking the user object in the req.query
  const ensuredLoggedInQuery = (req, res, next) => {
    try {
      // Add debugging statements to check the user object
      
      
      if (!req.query.user) {
        const e = new ExpressError("Unauthorized", 401);
        return next(e);
      } else {
        return next();
      }
    } catch (e) {
      return next(e);
    }
  };
  

module.exports = {logger, authenticateJWT, ensuredLoggedIn, authenticateJWTQuery, ensuredLoggedInQuery};