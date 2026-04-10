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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Hello this is Hunter
// 1. POST /bookings
// Books a seat on a specific ride.
app.post('/bookings', (req, res) => {
    const { rideID, goldCardNumber } = req.body;

    // Validate request body
    if (!rideID || !goldCardNumber) {
        return res.status(400).json({ 
            error: "Missing required fields: rideID and goldCardNumber" 
        });
    }

    // Insert the new booking into the database
    const sql = "INSERT INTO Booking (rideID, goldCardNumber, status) VALUES (?, ?, 'Confirmed')";
    
    db.query(sql, [rideID, goldCardNumber], (err, result) => {
        if (err) {
            console.error("SQL Error during booking:", err);
            return res.status(500).json({ error: "Internal server error while creating booking." });
        }
        
        // Return 201 Created with the new bookingID
        res.status(201).json({ bookingID: result.insertId });
    });
});

// 2. GET /users/:id/bookings
// Returns all rides a user has booked, including status and ride details.
app.get('/users/:id/bookings', (req, res) => {
    const goldCardNumber = req.params.id;

    // Use a JOIN to combine the Booking table with the Ride table.
    const sql = `
        SELECT 
            b.bookingID, 
            b.status, 
            r.rideID, 
            r.destination, 
            r.departureTime, 
            r.availableSeats 
        FROM Booking b
        JOIN Ride r ON b.rideID = r.rideID
        WHERE b.goldCardNumber = ?
    `;

    db.query(sql, [goldCardNumber], (err, results) => {
        if (err) {
            console.error("SQL Error fetching user bookings:", err);
            return res.status(500).json({ error: "Internal server error while fetching bookings." });
        }
        
        // Returns the array of bookings with status and ride details
        res.status(200).json(results);
    });
});

// 3. DELETE /bookings/:id
// Delete the booking created (from passenger side).
app.delete('/bookings/:id', (req, res) => {
    const bookingID = req.params.id;

    const sql = "DELETE FROM Booking WHERE bookingID = ?";
    db.query(sql, [bookingID], (err, result) => {
        if (err) {
            console.error("SQL Error deleting booking:", err);
            return res.status(500).json({ error: "Internal server error while deleting booking." });
        }
        
        // Check if a row was actually found and deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Booking not found." });
        }

        // Return success
        res.status(200).json({ message: "Booking successfully deleted." });
    });
});