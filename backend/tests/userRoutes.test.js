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
const jwt = require("jsonwebtoken");
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require("../config");

let testUser;
let testUserToken;
let testUserTwo;
let testUserTwoToken;
//Insert user into the user DATABASE
beforeEach(async () => {
  try {
    // Connect to the database
    const plainPassword = 'testpassword';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const result = await db.query(
      `INSERT INTO users (username, firstname, lastname, email, password, location, contact)
       VALUES ('testuser',
               'Test',
               'User',
               'test@example.com',
               $1,
               'Test City',
               'testcontact')
       RETURNING *`,
      [hashedPassword]  // Pass the hashed password as a parameter
    );

    const user = await db.query(`
      INSERT INTO users (username, firstname, lastname, email, password, location, contact)
      VALUES ('testuser22',
              'Test',
              'User',
              'test@example.com',
              $1, 
              'Test City',
              'testcontact')
      RETURNING *
    `, [hashedPassword]);  // Pass the hashed password as a parameter

    testUserTwo = user.rows[0];
    testUser = result.rows[0];
    testUserToken = jwt.sign(testUser, SECRET_KEY);
    testUserTwoToken = jwt.sign(testUserTwo, SECRET_KEY);
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
    const response = await request(app).get('/users').send({admin: true});

   
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual([testUser, testUserTwo]);
  });

  test("should return 401 when not Admin", async()=> {

    const response = await request(app).get("/users");

    expect(response.status).toBe(401);
  })
});

// Tests for the 'GET /users/:id' route
describe('GET /users/:id', () => {
  test('get a single user', async () => {
     // Ensure the response status is 200, the response is an array, and it matches the expected user.
    const response = await request(app).get(`/users/${testUser.userid}`).send({admin: true});

   
    expect(response.status).toBe(200); 
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual([testUser]) 
  });

  test('respond with 404 if user not found', async () => {
     // Ensure the response status is 200 (This may be an issue, it should be 404 if the user is not found)
    const response = await request(app).get(`/users/99`).send({admin: true});

   
    expect(response.status).toBe(404); 
    
     });
     
     test("should return 401 when not Admin", async ()=> {

      const response = await request(app).get(`/users/${testUser.userid}`);
  
      expect(response.status).toBe(401);
    })
  
});

// Tests to on creating a user 
describe("POST /users", ()=>{



  test('Create a single user', async () => {
    const plainPassword = 'testpassword'; 
    const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash with the same salt rounds
  
    try {
      const res = await request(app).post('/users').send({
        username: 'testuser2',
        firstName: 'Test2',
        lastName: 'User2',
        email: 'test@example12.com',
        password: plainPassword, 
        location: 'Test City',
        contact: 'testcontact',
        admin: false
      });
  
      // expect(res.status).toBe(201);
      expect(res.body[0]).toHaveProperty('username', 'testuser2'); // Check within the array
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
        {username: "wackboi12" , firstName: "James", lastName: "santos", admin: true }
      
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
      {username: "wackboi12" , firstName: "James", lastName: "santos", admin: true });

      expect(res.status).toBe(404);
  })
   
  test("should return 401 when not Admin", async ()=> {

    const  res = await request(app).patch(`/users/${testUser.userid}`).send(
      {username: "wackboi12" , firstName: "James", lastName: "santos", admin: false }
    
    );

    expect(res.status).toBe(401);
  })
})

//Test for the "DELETE" /users route
describe("DELETE/user", ()=>{

  test("DELETE a single user", async()=>{
    //send a DELETE request to delete user from the DATABASE
     const  res = await request(app).delete(`/users/${testUser.userid}`).send({admin: true});
      
      expect(res.status).toBe(200);
    
  })

  test("should return 401 when not Admin", async ()=> {

    const  res = await request(app).delete(`/users/${testUser.userid}`).send({admin: false});

    expect(res.status).toBe(401);
  })
})


describe("Changing User Password", ()=>{

  test("PATCH user's Password", async ()=>{

    //send a PATCH request to change password of User
      const res = await request(app).patch(`/users/password/${testUserTwo.userid}`).send({ 
         currentPassword:"testpassword" , newPassword: "newpassword" , token : testUserTwoToken, user: testUserTwo});
          
      expect(res.status).toBe(200);
  })



})