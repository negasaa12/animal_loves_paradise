const express = require("express");
const ExpressError = require("./expressError");
const middleware = require("./middleware");
const {authenticateJWT, ensuredLoggedIn} = require("./middleware")
const cors = require("cors");

const uRoutes = require("./routes/users");
const petRoutes = require("./routes/pets");
const auth =  require("./routes/auth");
const app = express();

app.use(cors())
app.use(express.json());


app.use(middleware.logger);


app.use("/pets", petRoutes);
app.use("/users", uRoutes)
app.get("/favico.ico", (req,res)=> res.sendStatus(204));
app.use(auth);

//404 handler
app.use(function(req,res,next){
    const err = new ExpressError;
    return next(err);
});



//generic error handler 
app.use(function (err, req,res,next){
    let status = err.status || 500 ;

    return res.status(status).json({
        error: {
            message: err.message,
            status: status
        }
    })
});

module.exports = app;
