const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

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

// Route: Get all users from User table
app.get('/api/users', (req, res) => {
    const sql = "SELECT goldCardNumber, name, email FROM User";
    
    db.query(sql, (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result); 
    });
});

// Route: Get all comments and stars for a specific driver
app.get('/api/drivers/:driverId/reviews', (req, res) => {
    const { driverId } = req.params;
    const sql = "SELECT comment, stars FROM Review WHERE driver_id = ?";
    
    db.query(sql, [driverId], (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result);
    });
});

// Route: Get vehicle details linked to a driver
app.get('/api/drivers/:driverId/vehicle', (req, res) => {
    const { driverId } = req.params;
    const sql = "SELECT * FROM Vehicle WHERE driver_id = ?";
    
    db.query(sql, [driverId], (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Vehicle not found" });
        }
        res.json(result[0]); // Assuming one vehicle per driver
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

