// Define configuration variables for the application

// Define the database URI based on the environment (test or production)
const DB_URI = (process.env.NODE_ENV === "test")
    ? "./tests/fakeDB"
    : "postgresql:///pet_adoption";

// Define a secret key for JWT (JSON Web Tokens) or use a default value
const SECRET_KEY = process.env.SECRET_KEY || "GREATBASEDAMAZED";

// Define the bcrypt work factor for password hashing
const BCRYPT_WORK_FACTOR = 12;

//Petfinder API keys & SECRET
let petfinderApiKey;
let petfinderApiSecret;
// Export the configuration variables for use in other modules. 

module.exports = {
    DB_URI,
    SECRET_KEY,
    BCRYPT_WORK_FACTOR,
    petfinderApiKey ,
    petfinderApiSecret
};
