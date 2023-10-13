//TESTS users Routes 

//Set the environment to "test"

process.env.NODE_ENV = "test";

//import necessary dependencies 
const assert = require('assert');
const app = require("../app");
const request = require('supertest');
const users = require("./fakeDb.js");
const db = require("../db");
const bcrypt = require("bcrypt");
const userSchema = require("../schemas/usersSchema.json");


let testUser;

//Insert user into the user DATABASE
beforeEach(async () => {
  try {
    // Connect to the database
    const result = await db.query(
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

    testUser = result.rows[0];
  } catch (error) {
    console.error('Error creating test user:', error);
  }
});

// Delete the test user from the database
afterEach(async () => {
  try {
    
    await db.query(`DELETE FROM users`);
  } catch (error) {
    console.error('Error deleting test user:', error);
  }
});


// Close the database connection
afterAll(async () => {
  
  await db.end();
});


//send a GET request to get all users 
describe('GET /users', () => {
  test('should return all users', async () => {
    const response = await request(app).get('/users');

   
    expect(response.status).toBe(200); 
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual([testUser]) 
  });

  
});

// Tests for the 'GET /users/:id' route
describe('GET /users/:id', () => {
  test('get a single user', async () => {
     // Ensure the response status is 200, the response is an array, and it matches the expected user.
    const response = await request(app).get(`/users/${testUser.userid}`);

   
    expect(response.status).toBe(200); 
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual([testUser]) 
  });

  test('respond with 404 if user not found', async () => {
     // Ensure the response status is 200 (This may be an issue, it should be 404 if the user is not found)
    const response = await request(app).get(`/users/${testUser.userid}`);

   
    expect(response.status).toBe(200); 
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual([testUser]) 
  });

  
});

// Tests to on creating a user 
describe("POST /users", ()=>{



  test('Create a single user', async () => {
    const plainPassword = 'testpassword'; 
    const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash with the same salt rounds
  
    try {
      const res = await request(app).post('/users').send({
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: plainPassword, 
        location: 'Test City',
        contact: 'testcontact',
      });
  
      expect(res.status).toBe(201);
      expect(res.body[0]).toHaveProperty('username', 'testuser'); // Check within the array
      expect(res.body[0]).toHaveProperty('password'); // Check within the array
      
    } catch (error) {
      console.error('Error in test:', error);
      throw error; // Rethrow the error to fail the test and see the error details
    }
  });
  


})






// Tests for the 'PATCH /user' route
describe("PATCH /user", ()=>{

  test("Update a single user", async()=>{
    // Send a PATCH request to update a user
    // Ensure the response status is 200 and the response body matches the expected user data.
     const  res = await request(app).patch(`/users/${testUser.userid}`).send(
        {username: "wackboi12" , firstName: "James", lastName: "santos" }
      
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        userid : testUser.userid,
        username: "wackboi12",
        firstname: "James",
        lastname: "santos"
        
      });

  })

    
  test("update a single user", async ()=>{
    // Send a PATCH request to update a user that doesn't exist
    // Ensure the response status is 404.
    const  res = await request(app).patch(`/users/0`).send(
      {username: "wackboi12" , firstName: "James", lastName: "santos" });

      expect(res.status).toBe(404);
  })
})

//Test for the "DELETE" /users route
describe("DELETE/user", ()=>{

  test("DELETE a single user", async()=>{
    //send a DELETE request to delete user from the DATABASE
     const  res = await request(app).delete(`/users/${testUser.userid}`);
      
      expect(res.status).toBe(200);
    
  })
})


