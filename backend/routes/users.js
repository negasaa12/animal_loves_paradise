


const express = require("express");
const router =  new express.Router();
const db = require("../db");
const jsonSchema = require("json-schema");
const userSchema = require("../schemas/usersSchema.json");
const bcrypt = require('bcrypt'); // For password hashing
const ExpressError = require("../expressError");


router.get("/",  async (req,res,next) =>{

  try{
    const results =  await db.query(`SELECT * FROM users`);
    return res.json(results.rows);

  }catch(e){
    return next(e);
  }
})

//CREATA USER
router.post("/", async (req, res, next) => {
  try {
    // Validate the request body against the userSchema
    const userPending = jsonSchema.validate(req.body, userSchema);

    if (!userPending.valid) {
      // Return a 400 Bad Request status with validation error details
      return res.status(400).json({ error: "Invalid data", details: userPending.errors });
    }

    const { username, firstName, lastName, email, password, location, contact } = req.body;

    // Hash the password before inserting it into the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    const results = await db.query(
      "INSERT INTO users (username, firstName, lastName, email, password, location, contact) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [username, firstName, lastName, email, hashedPassword, location, contact]
    );

    return res.status(201).json(results.rows); // 201 Created status for successful creation
  } catch (e) {
    return next(e);
  }
});

router.get("/:id",  async (req,res,next)=>{
    try{
        const id =  req.params.id;
        const results = await db.query(`SELECT * FROM users WHERE userid =$1`, [id])
        return res.json(results.rows)

    }catch(e){
        return next(e)
    }
})



router.patch("/:id", async (req,res,next)=>{

   try{
     
    const id = req.params.id;
    const {username, firstName, lastName} = req.body;
    const results = await db.query('UPDATE users SET username=$1, firstName=$2, lastName=$3 WHERE userid=$4 RETURNING userid, firstName, lastName, username', [username,firstName,lastName,id]);
     if(results.rows.length === 0){
      throw new ExpressError(`can't update user with id of ${id}`, 404)
     };
        
     return res.send(results.rows[0]);
   
    }  catch(e){
        return next(e);
   }

})


router.patch("/password/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { currentPassword, newPassword } = req.body;

    const userQuery = await db.query('SELECT * FROM users WHERE userid = $1', [id]);
    console.log('SQL Query:', userQuery.text); // Add this line to log the SQL query
    const currentUser = userQuery.rows[0];

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const results = await db.query('UPDATE users SET password=$1 WHERE userid=$2 RETURNING *', [hashedPassword, id]);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (e) {
    return next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
      const results = await db.query("DELETE FROM users WHERE userid = $1", [req.params.id]);
      return res.send({ msg: "DELETED" });
  } catch (e) {
      return next(e);
  }
});


module.exports = router; 