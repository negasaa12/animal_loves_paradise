

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const { json } = require("express");
const jwt = require("jsonwebtoken")
const {BYCRYPT_WORK_FACTOR , SECRET_KEY} = require("../config");
const {ensuredLoggedIn, authenticateJWT} = require("../middleware")

/**
 * @function POST /register
 * Register a new user with provided information.
 * @param {string} username - The username of the user.
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user (will be hashed before storing).
 * @param {string} location - The user's location.
 * @param {string} contact - The contact information of the user.
 * @throws {ExpressError} - If username or password is missing.
 * @returns {Object} - JSON response with the registered user's information.
 */
router.post("/register", async (req, res, next) => {
    try {
        const { username, firstName, lastName, email, password, location, contact } = req.body;

        if (!username || !password || !firstName || !lastName || !email || !location || !contact) {
            throw new ExpressError("all sections are required", 400);
        };
        
        // More specific email validation
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!email.match(emailRegex)) {
            throw new ExpressError("Invalid email address", 400);
        };
        
        const hashedPassword = await bcrypt.hash(password, 12);

        const results = await db.query(
            `
            INSERT INTO users (username, firstName, lastName, email, password, location, contact)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING username, password
            `,
            [username, firstName, lastName, email, hashedPassword, location, contact]
        );

        return res.json(results.rows[0]);
    } catch (e) {
        return next(e);
    }
});

/**
 * @function POST /login
 * Authenticate a user's login credentials and provide a JWT token on successful login.
 * @param {string} username - The username of the user.
 * @param {string} password - The user's password.
 * @throws {ExpressError} - If username or password is missing or if the login fails.
 * @returns {Object} - JSON response with a JWT token and user information on successful login.
 */
router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new ExpressError("Username and password required", 400);
        }
        const results = await db.query(
            `SELECT * FROM users
                 WHERE username = $1`,
            [username]
        );

        const user = results.rows[0];
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ username }, SECRET_KEY);
                return res.json({
                    msg: "Logged in",
                    token,
                    user: {
                        userid: user.userid,
                        username: user.username,
                        firstname: user.firstname,
                        lastname: user.firstname,
                    },
                });
            }
        }
        throw new ExpressError("Invalid username/password", 400);
    } catch (e) {
        return next(e);
    }
});

module.exports = router;