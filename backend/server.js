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

//DELETE ride by ID
app.delete('/api/rides/:id', (req, res) => {
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

//PUT update ride by ID
app.put('/api/rides/:id'), (req, res) => {
    const rideID = req.params.id;
    const { userID, startLocation, endLocation, rideDate } = req.body;

    //makes sure we aren't updating empty values
    if (!userID || !startLocation || !endLocation || !rideDate){
        return res.status(400).json({ Error: "Missing Required Fields" });
    }

    const sql = "UPDATE Ride SET userID = ?, startLocation = ?, endLocation = ?, rideDate = ? WHERE rideID = ?";
    //order must match this order in SQL statement
    db.query(sql, [userID, startLocation, endLocation, rideDate, rideID], (err, result) => {
        if (err) {
            console.error("SQL Error: ", err);
            return res.status(500).json({ Error: "Internal Server Error" });
        }
        //checking if ride exists
        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: "Ride not found" });
        }
        res.json({ Message: `Ride with ID: ${rideID} has been updated successfully` });

    });

    //GET ride by ID
    app.get('/api/rides/:id', (req, res) => {
        const rideID = req.params.id;
        const sql = "SELECT * FROM Ride WHERE rideID = ?";

        db.query(sql, [rideID], (err, result) => {
            if (err) {
                console.error("SQL Error: ", err);
                return res.status(500).json({ Error: "Internal Server Error" });
            }
            //returns list
            res.json(result);
        });
    });

}
