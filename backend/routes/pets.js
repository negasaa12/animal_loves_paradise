/**
 * This module defines various routes related to pet management and retrieval.
 * It interacts with an external pet data API, manages pet information, and handles user interactions with pets.
 * @module petRoutes
 */

const express = require("express");
const router = new express.Router();
const db = require("../db");
const jsonSchema = require("json-schema");
const petSchema = require("../schemas/petsSchema.json");
const axios = require("axios");
const bcrypt = require('bcrypt'); // For password hashing
const { searchPets, getAccessToken } = require("../petfinderservice");
const { ensuredLoggedIn, authenticateJWT, authenticateJWTQuery, ensuredLoggedInQuery } = require("../middleware");
const ExpressError = require("../expressError");

/**
 * @function GET /:userID/favpets
 * Retrieve a user's favorite pets based on their ID.
 * @param {string} userID - The user's ID.
 * @throws {ExpressError} - If no favorite pets are found for the user.
 * @returns {Object} - JSON response with the user's favorite pets.
 */
router.get("/:userID/favpets", authenticateJWTQuery, ensuredLoggedInQuery, async (req, res, next) => {
    try {
        const { userID } = req.params;
        console.log("REQUEST QUERY IN SERVICE ROUTE", req.query, userID);
        // Query the database to retrieve adopted pets for the specified user
        const results = await db.query(
            "SELECT pets.* FROM pets " +
            "JOIN User_Pet_Relationship ON pets.petid = User_Pet_Relationship.petid " +
            "WHERE User_Pet_Relationship.userid = $1 " +
            "AND User_Pet_Relationship.InteractionType = 'Adoption' " +
            "ORDER BY User_Pet_Relationship.Timestamp DESC",
            [userID]
        );

        console.log(results.rows);
        if (results.rows.length === 0) {
            // If no pets are found, throw an error
            return res.status(404).json({ error: "Can't find any favorite pets for the user." });
        }

        return res.status(200).json(results.rows);
    } catch (e) {
        return next(e);
    }
});

/**
 * @function GET /type/:type
 * Retrieve pets of a specific type (e.g., dogs, cats) from an external pet data API.
 * @param {string} type - The type of pets to retrieve (e.g., "dog", "cat").
 * @param {string} gender - Optional. Filter pets by gender.
 * @param {string} location - Optional. Filter pets by location.
 * @throws {ExpressError} - If there is an error while retrieving pet data.
 * @returns {Object} - JSON response with the retrieved pet data.
 */

router.get("/type/:type", async (req, res, next) => {
    try {
        const accessToken = await getAccessToken();
        const { type } = req.params;
        const { gender, location } = req.query;
        
        
        const response = await axios.get("https://api.petfinder.com/v2/animals", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                type,
                gender,
                location,
            }
        });
                    

        if (!response.data.error) {
            // If there are no animals in the response throw an error
           console.log(response.data);
            return res.json({ message: "No pets found for this criteria." });
        }
        const petData = response.data;
        
        return res.json(petData.animals);
    } catch (e) {
       return  next(e);
    }
});

/**
 * @function GET /id/:id
 * Retrieve pet details from an external pet data API by its ID.
 * @param {string} id - The ID of the pet to retrieve.
 * @throws {ExpressError} - If the pet is not found or there's an internal server error.
 * @returns {Object} - JSON response with the retrieved pet data.
 */
router.get("/id/:id", async (req, res, next) => {
    try {
        const accessToken = await getAccessToken();
        const id = req.params.id;

        // Use axios to fetch pet data from the external API
        const response = await axios.get(`https://api.petfinder.com/v2/animals/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        // Check if the response status code is 404 (Pet not found)
        if (response.status === 404) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        // Check if the response status code is not 200 (other errors)
        if (response.status !== 200) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        const petData = response.data;
        return res.json(petData);
    } catch (e) {
        // Handle Axios errors (e.g., network issues)
        return res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @function POST /add
 * Add a new pet to the database.
 * @param {Object} - Request body with pet information validated against petSchema.
 * @throws {ExpressError} - If the request body is not valid or there's an error while adding the pet.
 * @returns {Object} - JSON response indicating the successful addition of the pet.
 */
router.post("/add", authenticateJWT, ensuredLoggedIn, async (req, res, next) => {
    try {
        // Validate the request body against the userSchema
        const petPending = jsonSchema.validate(req.body, petSchema);

        if (!petPending.valid) {
            // Return a 400 Bad Request status with validation error details
            return res.status(400).json({ error: "Invalid data", details: petPending.errors });
        }

        const { name, breed, age, size, gender, type, description, photo, adopted, user, contact } = req.body;
        const userid = user.userid;
        console.log("USER ID FOR PET TO BE ADDED", userid);
        const petResult = await db.query(
            "INSERT INTO pets ( name, breed, age, size, gender, type, description, photo, adopted, contact) " +
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING petid, name, breed, age",
            [name, breed, age, size, gender, type, description, photo, adopted, contact]
        );

        const petId = petResult.rows[0].petid;
        const pet = petResult.rows[0];
        console.log("THIS IS PET ID", petId);
        await db.query(
            "INSERT INTO User_Pet_Relationship (UserID, PetID, InteractionType) VALUES ($1, $2, $3)",
            [userid, petId, 'Adoption']
        );

        return res.status(201).json({ message: 'Pet added successfully', pet });
    } catch (e) {
        return next(e);
    }
});

/**
 * @function DELETE /:id
 * Delete a pet from the database by its ID.
 * @param {string} id - The ID of the pet to delete.
 * @throws {ExpressError} - If there's an error while deleting the pet.
 * @returns {Object} - JSON response indicating the successful deletion of the pet.
 */
router.delete("/:id", async (req, res, next) => {
    try {
        // Delete related records in user_pet_relationship first
        await db.query("DELETE FROM user_pet_relationship WHERE PetID = $1", [req.params.id]);

        // Now, delete the pet from the pets table
        await db.query("DELETE FROM pets WHERE petId = $1", [req.params.id]);

        return res.send({ msg: "DELETED" });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
