process.env.NODE_ENV = "test";

const assert = require('assert');
const app = require("../app"); // Import your Express app
const request = require('supertest');
const db = require("../db");
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let testUserToken;

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


afterEach(async function (){

    await db.query("DELETE FROM users");
});

afterAll(async () => {
    // Close the database connection
    await db.end();
  });



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
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(plainPassword, BCRYPT_WORK_FACTOR, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  
    console.log('Hashed Password:', hashedPassword); // Add this line to log the hashed password
  
    const response = await request(app).post('/register').send(userObject);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'john_doe');
    expect(response.body).toHaveProperty('password'); // Check that 'password' property exists
  });
  

  test('missing a username or password', async function () {
    const res = await request(app).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      location: 'New York',
      contact: '123-456-7890',
    });
    // Add your assertions for the missing username or password scenario here
  });
});


describe("POST /login", function(){

    test("return logged in msg", async function(){
        const response = await request(app).post("/login").send({username: "testuser" ,password :"secret"});

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({token: expect.any(String)}));

    })

    test(" fails with wrong password", async function(){
        const response = await request(app).post("/login").send({username: "testuser" ,password :"WRONG"});

        expect(response.status).toBe(400);
    })
});

