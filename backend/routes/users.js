/**
 * This module defines routes for managing user data, including user creation, retrieval, update, and deletion.
 * It also includes routes for changing a user's password.
 * @module userRoutes
 */

const express = require("express");
const router = new express.Router();
const db = require("../db");
const jsonSchema = require("json-schema");
const userSchema = require("../schemas/usersSchema.json");
const bcrypt = require('bcrypt'); // For password hashing
const ExpressError = require("../expressError");
const { isAdmin }= require("../middleware");


/**
 * @function GET /
 * Retrieve a list of all users.
 * @throws {ExpressError} - If there's an error while retrieving user data.
 * @returns {Object} - JSON response with a list of users.
 */

router.get("/", isAdmin, async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM users`);
        return res.json(results.rows);
    } catch (e) {
        return next(e);
    }
});

/**
 * @function POST /
 * Create a new user with the provided information.
 * @param {Object} - Request body with user information validated against userSchema.
 * @throws {ExpressError} - If the request body is not valid or there's an error while creating the user.
 * @returns {Object} - JSON response indicating the successful creation of the user.
 */
router.post("/",  async (req, res, next) => {
    try {
        // Validate the request body against the userSchema
        const userPending = jsonSchema.validate(req.body, userSchema);

        if (!userPending.valid) {
            // Return a 400 Bad Request status with validation error details
            return res.status(400).json({ error: "Invalid data", details: userPending.errors });
        }

        const { username, firstName, lastName, email, password, location, contact, admin} = req.body;
        
        // Hash the password before inserting it into the database
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        const results = await db.query(
            "INSERT INTO users (username, firstName, lastName, email, password, location, contact, admin) VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, false)) RETURNING *",
            [username, firstName, lastName, email, hashedPassword, location, contact, admin]
        );

        return res.status(201).json(results.rows); // 201 Created status for successful creation
    } catch (e) {
        return next(e);
    }
});

/**
 * @function GET /:id
 * Retrieve user details by their ID.
 * @param {string} id - The ID of the user to retrieve.
 * @throws {ExpressError} - If the user with the specified ID is not found or if there's an error while retrieving user data.
 * @returns {Object} - JSON response with the user's details.
 */
router.get("/:id", isAdmin, async (req, res, next) => {
    try {
        const id = req.params.id;
        const results = await db.query(`SELECT * FROM users WHERE userid =$1`, [id]);
        if(results.rows.length === 0){
            throw new ExpressError("No user found", 404);
        }
        return res.json(results.rows);
    } catch (e) {
        return next(e);
    }
});

/**
 * @function PATCH /:id
 * Update user details by their ID.
 * @param {string} id - The ID of the user to update.
 * @param {string} username - New username for the user.
 * @param {string} firstName - New first name for the user.
 * @param {string} lastName - New last name for the user.
 * @throws {ExpressError} - If the user with the specified ID is not found or if there's an error while updating user data.
 * @returns {Object} - JSON response with the updated user details.
 */
router.patch("/:id", isAdmin, async (req, res, next) => {
    try {
        const id = req.params.id;
        const { username, firstName, lastName } = req.body;
        const results = await db.query('UPDATE users SET username=$1, firstName=$2, lastName=$3 WHERE userid=$4 RETURNING userid, firstName, lastName, username', [username, firstName, lastName, id]);

        if (results.rows.length === 0) {
            throw new ExpressError(`Can't update user with id of ${id}`, 404);
        }

        return res.send(results.rows[0]);
    } catch (e) {
        return next(e);
    }
});

/**
 * @function PATCH /password/:id
 * Update a user's password by their ID.
 * @param {string} id - The ID of the user to update.
 * @param {string} currentPassword - The user's current password for verification.
 * @param {string} newPassword - The new password to set for the user.
 * @throws {ExpressError} - If the user with the specified ID is not found, the current password is invalid, or if there's an error while updating the password.
 * @returns {Object} - JSON response indicating the successful update of the user's password.
 */
router.patch("/password/:id",  async (req, res, next) => {
    try {
        const id = req.params.id;
        const { currentPassword, newPassword } = req.body;

        const userQuery = await db.query('SELECT * FROM users WHERE userid = $1', [id]);
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

/**
 * @function DELETE /:id
 * Delete a user by their ID.
 * @param {string} id - The ID of the user to delete.
 * @throws {ExpressError} - If there's an error while deleting the user.
 * @returns {Object} - JSON response indicating the successful deletion of the user.
 */
router.delete("/:id", isAdmin, async (req, res, next) => {
    try {
        const results = await db.query("DELETE FROM users WHERE userid = $1", [req.params.id]);
        return res.send({ msg: "DELETED" });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
