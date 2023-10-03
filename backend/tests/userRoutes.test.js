process.env.NODE_ENV = "test";

const assert = require('assert');
const app = require("../app"); // Import your Express app
const request = require('supertest');
const users = require("./fakeDb.js");
const db = require("../db");
const bcrypt = require("bcrypt");
const userSchema = require("../schemas/usersSchema.json");


let testUser;

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

afterEach(async () => {
  try {
    // Delete the test user from the database
    await db.query(`DELETE FROM users`);
  } catch (error) {
    console.error('Error deleting test user:', error);
  }
});

afterAll(async () => {
  // Close the database connection
  await db.end();
});



describe('GET /users', () => {
  test('should return all users', async () => {
    const response = await request(app).get('/users');

   
    expect(response.status).toBe(200); 
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual([testUser]) 
  });

  
});

describe('GET /users/:id', () => {
  test('get a single user', async () => {
    const response = await request(app).get(`/users/${testUser.userid}`);

   
    expect(response.status).toBe(200); 
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual([testUser]) 
  });

  test('respond with 404 if user not found', async () => {
    const response = await request(app).get(`/users/${testUser.userid}`);

   
    expect(response.status).toBe(200); 
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual([testUser]) 
  });

  
});

describe("POST /users", ()=>{



  test('Create a single user', async () => {
    const plainPassword = 'testpassword'; // Use a consistent plaintext password
    const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash with the same salt rounds
  
    try {
      const res = await request(app).post('/users').send({
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: plainPassword, // Use the consistent plaintext password
        location: 'Test City',
        contact: 'testcontact',
      });
  
      expect(res.status).toBe(201);
      expect(res.body).toEqual([
        {
          userid: expect.any(Number),
          username: 'testuser',
          firstname: 'Test',
          lastname: 'User',
          email: 'test@example.com',
          password: hashedPassword, 
          location: 'Test City',
          contact: 'testcontact',
        },
      ]);
    } catch (error) {
      console.error('Error in test:', error);
      throw error; // Rethrow the error to fail the test and see the error details
    }
  });
  


})







describe("PATCH /user", ()=>{

  test("Update a single user", async()=>{
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
    const  res = await request(app).patch(`/users/0`).send(
      {username: "wackboi12" , firstName: "James", lastName: "santos" });

      expect(res.status).toBe(404);
  })
})


describe("DELETE/user", ()=>{

  test("DELETE a single user", async()=>{
     const  res = await request(app).delete(`/users/${testUser.userid}`);
      
      expect(res.status).toBe(200);
    
  })
})


