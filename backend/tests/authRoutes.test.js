
//TESTS authorization for login in and registering

//Set the environment to "test"
process.env.NODE_ENV = "test";

//Import require module and dependencies 
const assert = require('assert');
const app = require("../app"); // Import your Express app
const request = require('supertest');
const db = require("../db");
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let testUserToken;

// before each test, insert a test user into the database
beforeEach( async function(){

    const hashedPassword = await bcrypt.hash("secret", BCRYPT_WORK_FACTOR);
    await db.query(`INSERT INTO users (username, firstname, lastname, email, password, location, contact)
    VALUES ('testuser',
            'Test',
            'User',
            'test@example.com',
            $1,
            'Test City',
            'testcontact')`, [hashedPassword]);

            const testUser = {username: "testuser"};
            testUserToken = jwt.sign(testUser, SECRET_KEY);
});

//after each test, delete all user from the data base
afterEach(async function (){

    await db.query("DELETE FROM users");
});

// after all tests, close the database connection
afterAll(async () => {
    // Close the database connection
    await db.end();
  });


// Register User
describe('POST /register', () => {
  const plainPassword = 'testpassword';
  const userObject = {
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: plainPassword,
    location: 'New York',
    contact: '123-456-7890',
  };

  test('return {username, password}', async function () {

    //hash  the plain password
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(plainPassword, BCRYPT_WORK_FACTOR, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  
    
    //send a POST request to the /register with the userObject
    const response = await request(app).post('/register').send(userObject);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'john_doe');
    expect(response.body).toHaveProperty('password'); // Check that 'password' property exists
  });
  

  test('missing a username or password', async function () {
    //send a POST request to the /register route with incomplete userObject
    const res = await request(app).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      location: 'New York',
      contact: '123-456-7890',
    });
  });
});

//Login User 
describe("POST /login", function(){

    test("return logged in msg", async function(){
       // Send a POST request to the /login route with the test user's credentials
        const response = await request(app).post("/login").send({username: "testuser" ,password :"secret"});

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({token: expect.any(String)}));

    })

    test(" fails with wrong password", async function(){
        //send a POST request to /login with incorrect username/password
        const response = await request(app).post("/login").send({username: "testuser" ,password :"WRONG"});

        expect(response.status).toBe(400);
    })

    test("return logged in msg with a valid JWT token", async function(){
      //send a POSt reques to /login with a valid JWT token
      const response = await request(app).post("/login").send({username: "testuser", password: "secret"});
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({token: expect.any(String)}));
  
      // Extract the token from the response body
      const { token } = response.body;
  
      // Verify the token
      try {
          const decodedToken = jwt.verify(token, SECRET_KEY); 
          expect(decodedToken).toHaveProperty('username', 'testuser'); // Verify the payload properties
          // Add more assertions if needed
      } catch (error) {
          // If verification fails, the test will fail
          throw new Error('JWT verification failed: ' + error.message);
      }
  });
  
  test('fails with invalid JWT signature', async () => {
    // Create a tampered or invalid JWT token (e.g., changing a character in the signature)
    const tamperedToken = 'invalid.token.signature';

    // Attempt to verify the tampered token
    try {
      const decodedToken = jwt.verify(tamperedToken, "no"); // Replace 'your-secret-key' with your actual JWT secret key
      // If the verification succeeds, the test should fail
      expect(decodedToken).toBeUndefined(); 
    } catch (error) {
      // If verification fails, it should throw an error, and the test should pass
      expect(error).toBeInstanceOf(jwt.JsonWebTokenError);
      expect(error.message).toBe('invalid token');
    }
  });
    

  
});



