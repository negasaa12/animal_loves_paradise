


// Create a custom error class called 'ExpressError' that extends the built-in 'Error' class
class ExpressError extends Error {
    constructor(message,status){
        super();
        this.message = message;
        this.status = status;
        console.log(this.stack);
    }
}

module.exports = ExpressError;