
const jwt = require("jsonwebtoken")
const { SECRET_KEY} = require("./config");
const ExpressError = require("./expressError");


function logger(req,res,next){
    console.log("RECEIVED")
    return next();
}

function autheticateJWT(req,res,next){
    try{
        const payload = jwt.verify(req.body._token)
        req.user = payload;
        console.log("YOU HAVE A VALID TOKEN")
        return next();
    }catch(e){
        return next()
    }
}

function ensuredLoggedIn(req,res,next) {
    if(!req.user){
        const e = new ExpressError("Unauthorized", 401);
        return next(e)
    } else{
        return next();
    }
}

module.exports = {logger, autheticateJWT, ensuredLoggedIn};