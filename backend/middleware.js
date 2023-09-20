


function logger(req,res,next){
    console.log("RECEIVED")
    return next();
}

module.exports = {logger};