// Import the 'Client' class from the 'pg' module
const { Client } = require("pg");

// Define a variable for the database URI
let DB_URI;

// Determine the database URI based on the environment (test or production)
if (process.env.NODE_ENV === "test") {
    DB_URI = "postgresql:///pet_adoption_test";
} else {
    DB_URI = "postgresql:///pet_adoption";
}

// Create a new PostgreSQL client with the specified database URI
let db = new Client({
    connectionString: DB_URI
});

// Establish a connection to the PostgreSQL database
db.connect();

// Export the PostgreSQL client for use in other modules
module.exports = db;
