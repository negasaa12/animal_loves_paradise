

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const { json } = require("express");
const jwt = require("jsonwebtoken")
const {BYCRYPT_WORK_FACTOR , SECRET_KEY} = require("../config");
const {ensuredLoggedIn} = require("../middleware")


router.post("/register", async (req, res, next) => {
    try {
     

        const { username, firstName, lastName, email, password, location, contact } = req.body;

        if(!username || !password){
            throw new ExpressError("username and password required ", 400)
        }
        const hashedPassword = await bcrypt.hash(password, BYCRYPT_WORK_FACTOR);

        const results = await db.query(
            `
            INSERT INTO users (username, firstName, lastName, email, password, location, contact)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING username
            `,
            [username, firstName, lastName, email, hashedPassword, location, contact]
        );

        return res.json(results.rows[0]);
    } catch (e) {
        return next(e);
    }
});

router.post("/login" ,async (req,res,next)=>{

        try{

            const {username, password} = req.body;
            if(!username  || !password){
                throw new ExpressError("Username and password required", 400);
            }
            const results =  await db.query(
                `SELECT username, password
                 FROM users
                 WHERE username = $1`,
                 [username]);
                 
             const user = results.rows[0];
             if(user){
                if(await  bcrypt.compare(password, user.password)){
                    const token = jwt.sign({username}, SECRET_KEY);
                    return res.json({msg: "logged in", token})
                }
             }   
             throw new ExpressError("Invalid username/password", 400); 

        }catch(e){
            return next(e)
        }
})


module.exports = router;