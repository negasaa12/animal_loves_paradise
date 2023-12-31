//TESTS authorization for login in and registering

//Set the environment to "test"
process.env.NODE_ENV = "test";

//import necessary dependencies 
const assert = require('assert');
const app = require("../app"); // Import your Express app
const request = require('supertest');
const db = require("../db");
const petSchema = require("../schemas/petsSchema.json");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require("../config");

//Mock axios
jest.mock("axios");
let testPet;
let testUser;
let testUserToken;

//before each test  insert a user and pet to the database
beforeEach(async () => {
    try {
      // Connect to the database
      const result = await db.query(
        `INSERT INTO pets (name, breed, age, size, gender, type, description, photo, adopted, contact)
         VALUES ('testpet',
                 'shepperd',
                 'baby',
                 'Male',
                 'baby',
                 'cat',
                 'awesome',
                 'someimage.img',
                 'no',
                 'somerandomemail@email.com')
         RETURNING *`
      );
      
      const result2 = await db.query(
        `INSERT INTO users (username, firstname, lastname, email, password, location, contact)
         VALUES ('testuser',
                 'Test',
                 'User',
                 'test@example.com',
                 'testpassword',
                 'Test City',
                 'testcontact')
         RETURNING *`
      );
      
      testPet = result.rows[0];
      testUser = result2.rows[0];
        const petid = testPet.petid; 
        const userid = testUser.userid;
        testUserToken = jwt.sign(testUser, SECRET_KEY);
      await db.query(
        "INSERT INTO User_Pet_Relationship (UserID, PetID, InteractionType) VALUES ($1, $2, $3)",
        [userid, petid, 'Adoption']);
    } catch (error) {
      console.error('Error creating test user:', error);
    }
  });
  
  //Delete test user, pet, pet relationship to user off the database
  afterEach(async () => {
    try {
     
    await db.query(`DELETE FROM user_pet_relationship`);
    await db.query(`DELETE FROM pets`);
    await db.query(`DELETE FROM users`); 
    } catch (error) {
      console.error('Error deleting test user:', error);
    }
  });
  
   // Close the database connection
  afterAll(async () => {
   
    await db.end();
  });

    //Send a GET request to pets/:id/favpets to retreieve User's list of favorite pets
  describe("GET pets/:id/favpet", () => {
    test("get all favPets", async function () {
      // Assuming you have testUser and testUserToken defined
      const res = await request(app)
        .get(`/pets/${testUser.userid}/favpets`)
        .query({ user: testUser, token: testUserToken }); // Include user and token in query params
  
      expect(res.status).toBe(200); // Update status code to 200
  
      // Access the user and token from the response body
      const token = res.body.token;
      const user = res.body.user;
  
      try {
        console.log("Received Token:", testUserToken); // Log the token for debugging
        const decodedToken = jwt.verify(testUserToken, SECRET_KEY);
        console.log("Decoded Token:", decodedToken); 
       
      } catch (error) {
        throw new Error("JWT VERIFICATION FAILED: " + error.message);
      }
  
      // Provide the correct values for these properties based on your test data
      const expectedPet = {
        petid: expect.any(Number),
        name: "testpet",
        breed: "shepperd",
        contact: "somerandomemail@email.com", 
        age: "baby",
        size: "Male",
        gender: "baby",
        type: "cat",
        description: "awesome",
        photo: "someimage.img",
        adopted: "no",
      };
  
      expect(res.body).toEqual([expectedPet]);
    });
  });
  
  

  
  //sends a POST request to /pets/add to add a pet to the pet database and pet_user_relationship database
  describe("POST /pets/add", ()=>{
  
  
    
    test('add single pet', async () => {
      
      
    

        const res = await request(app).post('/pets/add').send({
            name: "Fluffy",
            breed: "Golden Retriever",
            age: "3 years",
            size: "Medium",
            gender: "Male",
            type: "Dog",
            description: "Friendly and playful dog looking for a loving home.",
            photo: "https://example.com/fluffy.jpg",
            adopted: "No",
          }).send({token: testUser, user: testUser});
    
            // Access the user and token from the response body
      const token = res.body.token;
      const user = res.body.user;
  
      try {
        console.log("Received Token:", testUserToken); // Log the token for debugging
        const decodedToken = jwt.verify(testUserToken, SECRET_KEY);
        console.log("Decoded Token:", decodedToken); // Log the decoded token for debugging
        // Verify the token and expected claims
        // expect(decodedToken).toHaveProperty("your_expected_property_name");
      } catch (error) {
        throw new Error("JWT VERIFICATION FAILED: " + error.message);
      }


        expect(res.status).toBe(201);
        expect(res.body).toEqual(
            { 
                message: "Pet added successfully",
                  pet : {name: "Fluffy",
                  petid :  expect.any(Number),
                breed: "Golden Retriever",
                age: "3 years",
               }
              },
        );
      
    });
    
  
  
  })
  


  
  
  //Deletes pets from pets database
describe("DELETE /pets", () => {
    test("DELETE a single pet", async () => {
      const res = await request(app).delete(`/pets/${testPet.petid}`).send({token: testUserToken, user: testUser}); 
  
      expect(res.status).toBe(200);
    });
  
    test("DELETE a single pet", async () => {
      const res = await request(app).delete(`/pets/${testPet.petid}`); 
  
      expect(res.status).toBe(401);
    });
    
  });
  


    
