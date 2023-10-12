const express = require("express");
const router =  new express.Router();
const db = require("../db");
const jsonSchema = require("json-schema");
const petSchema = require("../schemas/petsSchema.json");
const axios = require("axios");
const bcrypt = require('bcrypt'); // For password hashing
const {searchPets, getAccessToken} = require("../petfinderservice");
const { ensuredLoggedIn , authenticateJWT, authenticateJWTQuery, ensuredLoggedInQuery} = require("../middleware");

// router.get("/search",  async (req,res,next) =>{
//     try {

//         {gender, breed}
//         const accessToken = await getAccessToken();
//         const response = await axios.get('https://api.petfinder.com/v2/animals', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//           params : { gender: "female", coat: "medium" , type : "dog"
                 
//           }
//         });
//         const petData = response.data;
//         return res.json(petData.animals);
      
//       } catch (error) {
//         next(error);
//       }
// })


// Backend route to get a user's favorite pets
router.get("/:userID/favpets", authenticateJWTQuery, ensuredLoggedInQuery,  async (req, res, next) => {
  try {
    const { userID } = req.params;
    console.log("REQUEST QUERY IN SERVIER ROUTE", req.query, userID);
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




router.get("/type/:type",  async (req,res,next)=>{
    try{
      const accessToken = await getAccessToken();
        const {type} =  req.params;
        const {gender, location } = req.query;
        const response = await axios.get("https://api.petfinder.com/v2/animals", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params : {
             type,
             gender,
             location
             
          }
        });
        
        const petData = response.data;
        return res.json(petData.animals);

    }catch(e){
        return next(e)
    }
})


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



router.post("/add", authenticateJWT, ensuredLoggedIn,   async (req, res, next) => {
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
      "INSERT INTO pets ( name, breed, age, size, gender, type, description, photo, adopted, contact) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING petid ,name,  breed, age",
      [ name, breed, age, size, gender, type, description, photo, adopted, contact]
    );

    const petId = petResult.rows[0].petid;
      const pet = petResult.rows[0];
      console.log("THIS IS PET ID ", petId);
    await db.query(
      "INSERT INTO User_Pet_Relationship (UserID, PetID, InteractionType) VALUES ($1, $2, $3)",
      [userid, petId, 'Adoption']
    );

    return res.status(201).json({ message: 'Pet added successfully', pet });
  } catch (e) {
    return next(e);
  }
});

// Delete pet from DB
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
