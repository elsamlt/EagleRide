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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
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
        if (err) return res.status(500).json({ error: "Internal server error" });

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            const token = jwt.sign(
                { goldCardNumber: user.goldCardNumber, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).json({ 
                message: "Login successful", 
                token: token, 
                user: { 
                    goldCardNumber: user.goldCardNumber, 
                    name: user.name, 
                    email: user.email,
                    prefersMusic: user.prefersMusic,          
                    prefersConversation: user.prefersConversation, 
                    prefersPets: user.prefersPets,             
                    prefersSmoke: user.prefersSmoke,
                    driverLicense: user.driverLicense           
                }
            });
        } else {
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

// Route: Get all comments and stars for a specific driver
app.get('/users/:id/reviews', (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT 
            r.comment, 
            r.stars, 
            u.name AS reviewer_name
        FROM Review r
        JOIN Booking b ON r.bookingID = b.bookingID
        JOIN Books bk  ON b.bookingID = bk.bookingID
        JOIN User u    ON bk.goldCardNumber = u.goldCardNumber
        WHERE bk.goldCardNumber = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result);
    });
});

// Route: Get vehicle details linked to a driver
app.get('/users/:id/vehicle', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM Vehicle WHERE goldCardNumber = ?";
    
    db.query(sql, [id], (err, result) => {
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

// --- GET /rides ---
// Description: Returns a list of all available rides
app.get('/rides', (req, res) => {
    const { destination, date } = req.query;

    // only show rides with available seats
    let sql = `
        SELECT r.rideID, r.destination, r.departureTime, r.price, r.availableSeats, u.name AS driverName 
        FROM Ride r
        JOIN User u ON r.goldCardNumber = u.goldCardNumber
        WHERE r.availableSeats > 0`;
    
    let params = [];

    if (destination) {
        sql += " AND r.destination = ?";
        params.push(destination);
    }
    if (date) {
        sql += " AND r.date_ = ?";
        params.push(date);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Fetch Rides Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(200).json(results);
    });
});

// --- POST /rides ---
// Description: Creates a new ride (Driver only)
app.post('/rides', (req, res) => {
    const { destination, date_, departureTime, price, availableSeats, goldCardNumber } = req.body;

    // Step 1: Verify driver profile
    const verifySql = "SELECT profileVerified FROM User WHERE goldCardNumber = ?";
    db.query(verifySql, [goldCardNumber], (err, results) => {
        if (err || results.length === 0 || !results[0].profileVerified) {
            return res.status(403).json({ error: "Only verified drivers can post rides" });
        }

        // Step 2: Get the last rideID
        const maxIdSql = "SELECT MAX(rideID) AS lastId FROM Ride";
        db.query(maxIdSql, (err, maxResult) => {
            if (err) return res.status(500).json({ error: "Database error during ID fetch" });

            let nextId = "RIDE-001"; // Default ID if the table is empty

            if (maxResult[0].lastId) {
                // Extract the numeric part (e.g., "001" from "RIDE-001")
                const lastIdString = maxResult[0].lastId; 
                const numericPart = parseInt(lastIdString.split('-')[1]); // Converts "001" to number 1
                
                const nextNumber = numericPart + 1; // Increment (1 + 1 = 2)

                // Format back to "RIDE-XXX" with leading zeros
                // padStart(3, '0') transforms 2 into "002"
                nextId = `RIDE-${nextNumber.toString().padStart(3, '0')}`;
            }

            // Step 3: Insert into database
            const sql = `INSERT INTO Ride (rideID, destination, date_, departureTime, price, availableSeats, goldCardNumber) 
                         VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const values = [nextId, destination, date_, departureTime, price, availableSeats, goldCardNumber];

            db.query(sql, values, (err, result) => {
                if (err) {
                    console.error("Post Ride Error:", err);
                    return res.status(500).json({ error: "Failed to create ride" });
                }
                res.status(201).json({ message: "Ride created successfully", rideID: nextId });
            });
        });
    });
});

// --- GET /rides/:id ---
// Description: Returns details of one specific ride
app.get('/rides/:id', (req, res) => {
    const rideId = req.params.id;
    
    // Returns full ride object including the fields specified
    const sql = `
        SELECT destination, date_ AS date_, departureTime, price, availableSeats, goldCardNumber AS goldCardNumber 
        FROM Ride 
        WHERE rideID = ?`;

    db.query(sql, [rideId], (err, result) => {
        if (err) {
            console.error("Fetch Ride Detail Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }
        
        // Returns the single ride object
        res.status(200).json(result[0]);
    });

});

//DELETE ride by ID
app.delete('/rides/:id', (req, res) => {
    //gets ID from parameter
    const rideID = req.params.id;
    const sql = "DELETE FROM Ride WHERE rideID = ?";

    db.query(sql, [rideID], (err, result) => {
        if (err) {
            console.error("SQL Error: ", err);
            return res.status(500).json({ Error: "Internal Server Error" });
        }
        //checking if ID was actually deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: "Ride not found" });
        }

        res.json({ Message: `Ride with ID: ${rideID} was deleted successfully` });
    });

});

// --- PUT update ride by ID ---
// Description: Updates an existing ride's details
app.put('/rides/:id', (req, res) => {
    const rideID = req.params.id;
    // We use the column names from your database schema
    const { destination, date_, departureTime, price, availableSeats, goldCardNumber } = req.body;

    // Validation: Check if all required fields are present
    if (!destination || !date_ || !departureTime || !price || !availableSeats || !goldCardNumber) {
        return res.status(400).json({ Error: "Missing Required Fields" });
    }

    // SQL query using your actual column names
    const sql = `
        UPDATE Ride 
        SET destination = ?, date_ = ?, departureTime = ?, price = ?, availableSeats = ?, goldCardNumber = ? 
        WHERE rideID = ?`;
    
    const values = [destination, date_, departureTime, price, availableSeats, goldCardNumber, rideID];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("SQL Error during update: ", err);
            return res.status(500).json({ Error: "Internal Server Error" });
        }
        
        // Check if the rideID existed in the database
        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: `Ride with ID ${rideID} not found` });
        }
        
        res.json({ Message: `Ride with ID: ${rideID} has been updated successfully` });
    });
});

// --- GET /users/:id/rides ---
// Description: Returns all rides offered by a specific driver (goldCardNumber)
app.get('/users/:id/rides', (req, res) => {
    const goldCardNumber = req.params.id;

    // SQL query to find all rides linked to this driver
    const sql = `
        SELECT rideID, destination, date_, departureTime, price, availableSeats 
        FROM Ride 
        WHERE goldCardNumber = ?
        ORDER BY date_ DESC, departureTime DESC`;

    db.query(sql, [goldCardNumber], (err, results) => {
        if (err) {
            console.error("Fetch Driver Rides Error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        // Even if the driver has no rides, we return an empty array [] (status 200)
        res.status(200).json(results);
    });
});

// Route: Confirm or modify the booking status
app.patch('/bookings/:id', (req, res) => {
    const { id } = req.params; 
    const { status } = req.body; 

    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }

    const sql = "UPDATE Booking SET status = ? WHERE bookingID = ?";

    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        // 2. Vérifier si le booking existait bien
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.json({ message: "Booking status updated successfully", status });
    });
});
