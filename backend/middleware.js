
const jwt = require("jsonwebtoken")
const { SECRET_KEY} = require("./config");
const ExpressError = require("./expressError");


function logger(req,res,next){
    console.log("RECEIVED")
    return next();
}
function authenticateJWT(req, res, next) {
    try { 
      
      const token = req.body.token;
      if (!token) {
        
      
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
  
  const ensuredLoggedIn = (req, res, next) => {
    try {
      // Add debugging statements to check the user object
      console.log("User object in ensuredLoggedIn middleware:", req.body);
      
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
  

module.exports = {logger, authenticateJWT, ensuredLoggedIn};