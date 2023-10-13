// Import required modules and dependencies
const express = require("express");
const ExpressError = require("./expressError");
const middleware = require("./middleware");
const { authenticateJWT, ensuredLoggedIn } = require("./middleware");
const cors = require("cors");

const uRoutes = require("./routes/users");
const petRoutes = require("./routes/pets");
const auth = require("./routes/auth");

// Create an Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Apply custom logger middleware
app.use(middleware.logger);

// Define routes for '/pets' and '/users'
app.use("/pets", petRoutes);
app.use("/users", uRoutes);

// Serve a 204 status for the favicon.ico request
app.get("/favico.ico", (req, res) => res.sendStatus(204));

// Use the 'auth' route
app.use(auth);

// 404 Error Handler: Handle requests for undefined routes
app.use(function (req, res, next) {
    const err = new ExpressError();
    return next(err);
});

// Generic Error Handler: Handle all other errors
app.use(function (err, req, res, next) {
    // Set the HTTP status code based on the error's status or default to 500 (Internal Server Error)
    let status = err.status || 500;

    // Respond with a JSON error object containing the error message and status code
    return res.status(status).json({
        error: {
            message: err.message,
            status: status
        }
    });
});

// Export the Express application for use in other modules
module.exports = app;
