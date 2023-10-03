process.env.NODE_ENV = "test";

const assert = require('assert');
const app = require("../app"); // Import your Express app
const request = require('supertest');
const db = require("../db");
const petSchema = require("../schemas/petsSchema.json");
const axios = require("axios");
jest.mock("axios");
let testPet;
let testUser;

beforeEach(async () => {
    try {
      // Connect to the database
      const result = await db.query(
        `INSERT INTO pets (name, breed, age, size, gender, type, description, photo, adopted)
         VALUES ('testpet',
                 'shepperd',
                 'baby',
                 'Male',
                 'baby',
                 'cat',
                 'awesome',
                 'someimage.img',
                 'no')
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
        
      await db.query(
        "INSERT INTO User_Pet_Relationship (UserID, PetID, InteractionType) VALUES ($1, $2, $3)",
        [userid, petid, 'Adoption']);
    } catch (error) {
      console.error('Error creating test user:', error);
    }
  });
  
  afterEach(async () => {
    try {
      // Delete the test user from the database
      
        // Delete the test user and test pet from the database
    await db.query(`DELETE FROM user_pet_relationship`);
    await db.query(`DELETE FROM pets`);
    await db.query(`DELETE FROM users`); // Add this line to delete test users
    } catch (error) {
      console.error('Error deleting test user:', error);
    }
  });
  
  afterAll(async () => {
    // Close the database connection
    await db.end();
  });

  describe("GET pets/:id/favpet", () => {
    test("get all favPets", async function () {
      const res = await request(app).get(`/pets/${testUser.userid}/favpets`);
  
      expect(res.status).toBe(200); // Update status code to 200
  
      // Provide the correct values for these properties based on your test data
      const expectedPet = {
        petid : expect.any(Number),
        name: "testpet",
        breed: "shepperd",
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
  
  
  
  describe("POST /pets/add", ()=>{
  
  
  
    test('add single pet', async () => {
      
      
    
      try {
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
          });
    
        expect(res.status).toBe(201);
        expect(res.body).toEqual(
            { 
                message: "Pet added successfully",
                  pet : {name: "Fluffy",
                breed: "Golden Retriever",
                age: "3 years",
               }
              },
        );
      } catch (error) {
        console.error('Error in test:', error);
        throw error; // Rethrow the error to fail the test and see the error details
      }
    });
    
  
  
  })
  

//   describe('GET /pets/id/:id', () => {
//     it('should return pet data for a valid ID', async () => {
//       // Mock Axios response with the data you want to test
//       const mockResponseData = {
//         id: 22,
//         name: "Woofy",
//         breed: "Retriever",
//         age: "Baby",
//         size: "Medium",
//         gender: "Male",
//         type: "Dog",
//         description: "Friendly and playful dog looking for a loving home.",
//         photo: "https://example.com/fluffy.jpg",
//         adopted: "No",
//       };
  
//       // Mock Axios response with a 200 status code
//       axios.get.mockResolvedValue({ status: 200, data: mockResponseData });
  
//       // Make a request to the route with a valid ID
//       const response = await request(app).get(`/pets/id/${mockResponseData.id}`); // Replace with a valid ID
  
//       // Verify the status code and response data
//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(mockResponseData);
//     });
//   });
  
      
  
//   describe('GET /pets', () => {
//     it('should return  all pets FROM API', async () => {
//       // Mock Axios response with the data you want to test
//       const mockResponseData = {
//         id: 22,
//         name: "Woofy",
//         breed: "Retriever",
//         age: "Baby",
//         size: "Medium",
//         gender: "Male",
//         type: "Dog",
//         description: "Friendly and playful dog looking for a loving home.",
//         photo: "https://example.com/fluffy.jpg",
//         adopted: "No",
//       };
  
//       // Mock Axios response with a 200 status code
//       axios.get.mockResolvedValue({ status: 200, data: mockResponseData });
  
//       // Make a request to the route with a valid ID
//       const response = await request(app).get(`/pets/`); 
  
//       // Verify the status code and response data
//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(mockResponseData);
//     });
//   });
  
  

  
  
  
describe("DELETE /pets", () => {
    test("DELETE a single pet", async () => {
      const res = await request(app).delete(`/pets/${testPet.petid}`); // Use testPet.petId
  
      expect(res.status).toBe(200);
    });
  });
  


    
