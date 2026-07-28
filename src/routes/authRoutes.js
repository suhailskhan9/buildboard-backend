import express from 'express';
import pool from "../db/database.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
        const { email, username, password } = req.body ?? {};
        
        if(!email || !username || !password) {
            return res.status(400).json({
                message: "Missing required fields"
            })
        }
        
        const existingEmail = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if(existingEmail.rowCount !== 0) {
            return res.status(409).json({
                message: "Email already exists"
            })
        }
        
        const existingUsername = await pool.query("SELECT id FROM users WHERE username = $1", [username])
        if(existingUsername.rowCount !== 0) {
            return res.status(409).json({
                message: "Username already exists"
            })
        }
        
        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query("INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3)", [email, username, passwordHash]);
        return res.status(201).json({
            message: "User created successfully"
        })
})

authRouter.post("/login", async (req, res) => {
        const { email, password } = req.body ?? {};

        if(!email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const userResult = await pool.query("SELECT id, password_hash FROM users WHERE email = $1", [email])
        if(userResult.rowCount === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }
        const id = userResult.rows[0].id;
        const storedHash = userResult.rows[0].password_hash;

        const isPasswordValid = await bcrypt.compare(password, storedHash);
        if(!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign({ id, email }, process.env.SECRET_KEY);

        return res.status(200).json({
            message: "Login successful",
            token: token
        })
})

export default authRouter;