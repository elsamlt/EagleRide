const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware
app.use(cors()); // Allow Frontend to communicate with Backend
app.use(express.json()); // Parse JSON bodies

// Database connection configuration using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to Alwaysdata MySQL database
db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to Alwaysdata database successfully.");
});

// --- POST /auth/register ---
// Description: Creates a new user account with mandatory preferences.
app.post('/auth/register', async (req, res) => {
    const { 
        goldCardNumber, 
        name, 
        email, 
        password, 
        dateOfBirth, 
        phoneNumber,
        prefersMusic,
        prefersConversation,
        prefersPets,
        prefersSmoke,
        driverLicense
    } = req.body;

    // 1. Validation: Ensure mandatory fields are provided (excluding driverLicense if optional)
    if (!goldCardNumber || !name || !email || !password || !dateOfBirth || !phoneNumber || 
        !prefersMusic || !prefersConversation || !prefersPets || !prefersSmoke) {
        return res.status(400).json({ error: "All fields including preferences are mandatory" });
    }

    if (!email.endsWith('@juniata.edu')) {
        return res.status(400).json({ error: "Juniata email mandatory" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = `
            INSERT INTO User (
                goldCardNumber, name, email, password, dateOfBirth, 
                phoneNumber, profileVerified, prefersMusic, 
                prefersConversation, prefersPets, prefersSmoke, 
                driverLicense, numberStars
            ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, 0)`;
        
        const values = [
            goldCardNumber, name, email, hashedPassword, dateOfBirth, 
            phoneNumber, 
            prefersMusic, prefersConversation, prefersPets, prefersSmoke,
            driverLicense || null // If empty, insert NULL
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: "Gold Card Number or Email already exists" });
                }
                console.error("Registration SQL Error:", err);
                return res.status(500).json({ error: "Registration failed" });
            }

            res.status(201).json({ 
                goldCardNumber: goldCardNumber, 
                message: "User account created successfully" 
            });
        });
    } catch (e) {
        res.status(500).json({ error: "Internal server error during registration" });
    }
});

// --- POST /auth/login ---
// Description: Authenticates a user and generates a session token (JWT).
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM User WHERE email = ?";
    
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Login SQL Error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        // If no user found with that email
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];
        // Compare provided password with the hashed password in DB
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // 1. Generate the JWT Token
            // We store the goldCardNumber and email in the payload
            const token = jwt.sign(
                { 
                    goldCardNumber: user.goldCardNumber, 
                    email: user.email 
                },
                process.env.JWT_SECRET, // Secret key from your .env
                { expiresIn: '24h' }    // Token expires in 24 hours
            );

            // 2. Return 200 OK with user details and the token
            res.status(200).json({ 
                message: "Login successful", 
                token: token, 
                user: { 
                    goldCardNumber: user.goldCardNumber, 
                    name: user.name, 
                    email: user.email 
                }
            });
        } else {
            // Password does not match
            res.status(401).json({ error: "Invalid email or password" });
        }
    });
});

// --- GET /users/:id ---
// Description: Returns profile details for a specific user using goldCardNumber.
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    // Selecting fields based on the MCD attributes
    const sql = "SELECT goldCardNumber, name, email, prefersMusic, prefersConversation, prefersPets, prefersSmoke, numberStars FROM User WHERE goldCardNumber = ?";

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Fetch User SQL Error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Send back the first (and only) result
        res.status(200).json(result[0]);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});