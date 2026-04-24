const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to Alwaysdata database successfully.");
});

// --- ROUTES ---

// POST /auth/register
app.post('/auth/register', async (req, res) => {
    const { goldCardNumber, name, email, password, dateOfBirth, phoneNumber, prefersMusic, prefersConversation, prefersPets, prefersSmoke, driverLicense } = req.body;

    if (!goldCardNumber || !name || !email || !password || !dateOfBirth || !phoneNumber || prefersMusic === undefined || prefersConversation === undefined || prefersPets === undefined || prefersSmoke === undefined) {
        return res.status(400).json({ error: "All fields including preferences are mandatory" });
    }

    if (!email.endsWith('@juniata.edu')) {
        return res.status(400).json({ error: "Juniata email mandatory" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO User (goldCardNumber, name, email, password, dateOfBirth, phoneNumber, profileVerified, prefersMusic, prefersConversation, prefersPets, prefersSmoke, driverLicense, numberStars) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, 0)`;
        const values = [goldCardNumber, name, email, hashedPassword, dateOfBirth, phoneNumber, prefersMusic, prefersConversation, prefersPets, prefersSmoke, driverLicense || null];

        db.query(sql, values, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: "Gold Card Number or Email already exists" });
                return res.status(500).json({ error: "Registration failed" });
            }
            res.status(201).json({ goldCardNumber, message: "User account created successfully" });
        });
    } catch (e) {
        res.status(500).json({ error: "Internal server error during registration" });
    }
});

// POST /auth/login
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM User WHERE email = ?", [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: "Invalid email or password" });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ goldCardNumber: user.goldCardNumber, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.status(200).json({ message: "Login successful", token, user });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    });
});

// PUT /users/:id
app.put('/users/:id', (req, res) => {
    const goldCardNumber = req.params.id;
    const { name, dateOfBirth, phoneNumber, prefersMusic, prefersConversation, prefersPets, prefersSmoke, driverLicense } = req.body;
    const sql = `UPDATE User SET name = ?, dateOfBirth = ?, phoneNumber = ?, prefersMusic = ?, prefersConversation = ?, prefersPets = ?, prefersSmoke = ?, driverLicense = ? WHERE goldCardNumber = ?`;
    db.query(sql, [name, dateOfBirth, phoneNumber, prefersMusic, prefersConversation, prefersPets, prefersSmoke, driverLicense, goldCardNumber], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to update profile" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "Profile updated successfully" });
    });
});

// GET /users/:id
app.get('/users/:id', (req, res) => {
    db.query("SELECT * FROM User WHERE goldCardNumber = ?", [req.params.id], (err, result) => {
        if (err || result.length === 0) return res.status(404).json({ error: "User not found" });
        res.status(200).json(result[0]);
    });
});

// GET /rides
app.get('/rides', (req, res) => {
    const { destination, date } = req.query;
    let sql = `SELECT r.*, u.name AS driverName FROM Ride r JOIN User u ON r.goldCardNumber = u.goldCardNumber WHERE r.availableSeats > 0`;
    let params = [];
    if (destination) { sql += " AND r.destination = ?"; params.push(destination); }
    if (date) { sql += " AND r.date_ = ?"; params.push(date); }
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(200).json(results);
    });
});

// POST /rides
app.post('/rides', (req, res) => {
    const { destination, date_, departureTime, price, availableSeats, goldCardNumber } = req.body;
    db.query("SELECT profileVerified FROM User WHERE goldCardNumber = ?", [goldCardNumber], (err, results) => {
        if (err || results.length === 0 || !results[0].profileVerified) return res.status(403).json({ error: "Only verified drivers can post rides" });
        
        db.query("SELECT MAX(rideID) AS lastId FROM Ride", (err, maxResult) => {
            let nextId = "RIDE-001";
            if (maxResult[0].lastId) {
                const num = parseInt(maxResult[0].lastId.split('-')[1]) + 1;
                nextId = `RIDE-${num.toString().padStart(3, '0')}`;
            }
            db.query("INSERT INTO Ride (rideID, destination, date_, departureTime, price, availableSeats, goldCardNumber) VALUES (?, ?, ?, ?, ?, ?, ?)", [nextId, destination, date_, departureTime, price, availableSeats, goldCardNumber], (err) => {
                if (err) return res.status(500).json({ error: "Failed to create ride" });
                res.status(201).json({ message: "Ride created successfully", rideID: nextId });
            });
        });
    });
});

// DELETE /rides/:id
app.delete('/rides/:id', (req, res) => {
    db.query("DELETE FROM Ride WHERE rideID = ?", [req.params.id], (err, result) => {
        if (err || result.affectedRows === 0) return res.status(500).json({ error: "Failed to delete" });
        res.json({ Message: "Deleted successfully" });
    });
});

// PUT /rides/:id
app.put('/rides/:id', (req, res) => {
    const { destination, date_, departureTime, price, availableSeats, goldCardNumber } = req.body;
    db.query("UPDATE Ride SET destination = ?, date_ = ?, departureTime = ?, price = ?, availableSeats = ?, goldCardNumber = ? WHERE rideID = ?", 
    [destination, date_, departureTime, price, availableSeats, goldCardNumber, req.params.id], (err, result) => {
        if (err || result.affectedRows === 0) return res.status(500).json({ Error: "Update failed" });
        res.json({ Message: "Updated successfully" });
    });
});

// POST /bookings
app.post('/bookings', (req, res) => {
    const { rideID, goldCardNumber } = req.body;
    db.query("SELECT MAX(bookingID) AS lastId FROM Booking", (err, maxResult) => {
        let nextBookingId = "BOOK-001";
        if (maxResult[0].lastId) {
            const num = parseInt(maxResult[0].lastId.split('-')[1]) + 1;
            nextBookingId = `BOOK-${num.toString().padStart(3, '0')}`;
        }
        db.query("INSERT INTO Booking (bookingID, rideID, goldCardNumber, status) VALUES (?, ?, ?, 'pending')", [nextBookingId, rideID, goldCardNumber], (err) => {
            if (err) return res.status(500).json({ error: "Failed to create booking" });
            //seats fix
            db.query("UPDATE Ride SET availableSeats = availableSeats - 1 WHERE rideID = ?", [rideID], (err) => {
                if (err) return res.status(500).json({ error: "Failed to update available seats" });
                res.status(201).json({ message: "Booking successful", bookingID: nextBookingId});
            });
        });
    });
});
//DELETE /bookings
app.delete('/bookings/:id', (req, res) => {
    const bookingID = req.params.id;
    //get rideID from booking before deleting
    db.query("SELECT rideID FROM Booking WHERE bookingID = ?", [bookingID], (err, result) => {
        if (err || result.length === 0) 
            return res.status(404).json({ error: "Booking not found" });
        const rideID = result[0].rideID;
        //deleting booking
        db.query("DELETE FROM Booking WHERE bookingID = ?", [bookingID], (err, result) => {
            if (err || result.affectedRows === 0)
                return res.status(500).json({ error: "Failed to cancel booking" });
            //seats fix
            db.query("UPDATE Ride SET availableSeats = availableSeats + 1 WHERE rideID = ?", [rideID], (err, result) => {
                if (err) return res.status(500).json({ error: "Booking has been canceled but the seat has not been restored" });
                res.status(200).json({ message: "Booking canceled successfully"});
            })
            
        });
    });
});