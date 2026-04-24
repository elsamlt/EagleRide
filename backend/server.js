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
                    dateOfBirth: user.dateOfBirth,
                    phoneNumber: user.phoneNumber,
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

// Route: Get all comments and stars for a specific driver
app.get('/users/:id/reviews', (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            r.reviewID,
            r.comment,
            r.stars,
            u.name AS passengerName
        FROM Review r
        JOIN Booking b ON r.bookingID = b.bookingID
        JOIN Ride ri ON b.rideID = ri.rideID
        JOIN User u ON b.goldCardNumber = u.goldCardNumber
        WHERE ri.goldCardNumber = ?
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

/**
 * POST /vehicles
 * Registers a new vehicle for a user.
 */
app.post('/vehicles', (req, res) => {
    const { plateNumber, model, color, goldCardNumber } = req.body;

    if (!plateNumber || !model || !color || !goldCardNumber) {
        return res.status(400).json({ error: "All vehicle fields are required" });
    }

    const sql = "INSERT INTO Vehicle (plateNumber, model, color, goldCardNumber) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [plateNumber, model, color, goldCardNumber], (err, result) => {
        if (err) {
            console.error("SQL Error (Insert Vehicle):", err);
            return res.status(500).json({ error: "Internal server error while adding vehicle" });
        }
        res.status(201).json({ message: "Vehicle successfully registered" });
    });
});

/**
 * PUT /vehicles/:id
 * Updates vehicle details based on the owner's Gold Card Number.
 */
app.put('/vehicles/:id', (req, res) => {
    const goldCardNumber = req.params.id;
    const { plateNumber, model, color } = req.body;

    const sql = "UPDATE Vehicle SET plateNumber = ?, model = ?, color = ? WHERE goldCardNumber = ?";
    
    db.query(sql, [plateNumber, model, color, goldCardNumber], (err, result) => {
        if (err) {
            console.error("SQL Error (Update Vehicle):", err);
            return res.status(500).json({ error: "Internal server error while updating vehicle" });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No vehicle found for this user" });
        }
        
        res.status(200).json({ message: "Vehicle information updated successfully" });
    });
});

// --- GET /rides ---
// Description: Returns a list of all available rides
app.get('/rides', (req, res) => {
    const { destination, date, userId } = req.query;

    let params = [];

    let sql = `
        SELECT r.rideID, r.destination, r.departureTime, r.price, r.origin, r.availableSeats, r.date_, u.name AS driverName 
        FROM Ride r
        JOIN User u ON r.goldCardNumber = u.goldCardNumber
        WHERE r.availableSeats > 0
    `;

    if (userId) {
        sql += ` 
            AND r.goldCardNumber != (SELECT goldCardNumber FROM User WHERE goldCardNumber = ?)
            AND r.rideID NOT IN (
                SELECT rideID FROM Booking WHERE goldCardNumber = (SELECT goldCardNumber FROM User WHERE goldCardNumber = ?)
            )
        `;
        params.push(userId, userId);
    }

    if (destination) {
        sql += " AND r.destination = ?";
        params.push(destination);
    }
    if (date) {
        sql += " AND r.date_ = ?";
        params.push(date);
    }

    sql += " ORDER BY r.date_ ASC, r.departureTime ASC";

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(200).json(results);
    });
});

/**
 * GET /users/:id/offers
 * Description: Returns rides created by the user with their associated bookings.
 */
app.get('/users/:id/offers', (req, res) => {
    const userId = req.params.id;

    const ridesSql = `
        SELECT *, DATE_FORMAT(date_, '%m/%d') AS date 
        FROM Ride 
        WHERE goldCardNumber = ? 
        ORDER BY date_ DESC`;

    db.query(ridesSql, [userId], (err, rides) => {
        if (err) return res.status(500).json({ error: "Database error fetching rides" });
        if (rides.length === 0) return res.json([]);

        const rideIds = rides.map(r => r.rideID);
        const bookingsSql = `
            SELECT 
                b.bookingID, b.status, b.rideID, 
                u.name, u.goldCardNumber AS passengerID,
                u.numberStars AS passengerRating,
                (SELECT AVG(stars) FROM Review WHERE bookingID IN (SELECT bookingID FROM Booking WHERE goldCardNumber = u.goldCardNumber)) AS rating
            FROM Booking b
            JOIN User u ON b.goldCardNumber = u.goldCardNumber
            WHERE b.rideID IN (?)`;

        db.query(bookingsSql, [rideIds], (err, bookings) => {
            if (err) return res.status(500).json({ error: "Database error fetching bookings" });

            const results = rides.map(ride => {
                const rideBookings = bookings.filter(b => b.rideID === ride.rideID);
                
                return {
                    ...ride,
                    pendingRequests: rideBookings.filter(b => b.status === 'pending'),
                    confirmedPassengers: rideBookings.filter(b => b.status === 'confirmed')
                };
            });

            res.status(200).json(results);
        });
    });
});

// --- POST /rides ---
// Description: Creates a new ride (Driver only)
app.post('/rides', (req, res) => {
    const { destination, date_, departureTime, price, availableSeats, goldCardNumber, origin } = req.body;

    const verifySql = "SELECT profileVerified FROM User WHERE goldCardNumber = ?";
    db.query(verifySql, [goldCardNumber], (err, results) => {
        if (err || results.length === 0 || !results[0].profileVerified) {
            return res.status(403).json({ error: "Only verified drivers can post rides" });
        }

        const maxIdSql = "SELECT MAX(rideID) AS lastId FROM Ride";
        db.query(maxIdSql, (err, maxResult) => {
            if (err) return res.status(500).json({ error: "Database error during ID fetch" });

            let nextId = "RIDE-001";

            if (maxResult[0].lastId) {
                const lastIdString = maxResult[0].lastId; 
                const numericPart = parseInt(lastIdString.split('-')[1]); 
                
                const nextNumber = numericPart + 1;

                nextId = `RIDE-${nextNumber.toString().padStart(3, '0')}`;
            }

            const sql = `INSERT INTO Ride (rideID, destination, date_, departureTime, price, availableSeats, goldCardNumber, origin) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [nextId, destination, date_, departureTime, price, availableSeats, goldCardNumber, origin];

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
    
    const sql = `
        SELECT 
            r.rideID, 
            r.destination, 
            r.origin, 
            r.date_ AS date, 
            r.departureTime, 
            r.price, 
            r.availableSeats, 
            r.goldCardNumber AS driverID,
            u.name AS driverName,
            u.phoneNumber AS driverPhone,
            u.email AS driverEmail
        FROM Ride r
        JOIN User u ON r.goldCardNumber = u.goldCardNumber
        WHERE r.rideID = ?`;

    db.query(sql, [rideId], (err, result) => {
        if (err) {
            console.error("Fetch Ride Detail Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }
        
        // Renvoie l'objet complet avec les infos du trajet + du conducteur
        res.status(200).json(result[0]);
    });
});

// --- GET /rides/:id/reviews ---
// Description: Returns passenger reviews for a specific ride
app.get('/rides/:id/reviews', (req, res) => {
    const rideId = req.params.id;

    const sql = `
        SELECT 
            r.reviewID,
            r.comment,
            r.stars,
            u.name AS passengerName
        FROM Review r
        JOIN Booking b ON r.bookingID = b.bookingID
        JOIN User u ON b.goldCardNumber = u.goldCardNumber
        WHERE b.rideID = ?`;

    db.query(sql, [rideId], (err, result) => {
        if (err) {
            console.error("Fetch Ride Reviews Error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json(result);
    });
});

//DELETE ride by ID
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

// --- PATCH increment seats ---
app.patch('/rides/:id/increment-seats', (req, res) => {
    const rideID = req.params.id;
    const sql = "UPDATE Ride SET availableSeats = availableSeats + 1 WHERE rideID = ?";

    db.query(sql, [rideID], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Seat incremented" });
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

    
// --- POST /bookings ---
// Books a seat on a specific ride.
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

// --- GET /users/:id/bookings ---
// Returns all rides a user has booked, including status and ride details.
app.get('/users/:id/bookings', (req, res) => {
    const goldCardNumber = req.params.id;
    const { status } = req.query; 

    let sql = `
        SELECT 
            b.bookingID, 
            b.status, 
            r.rideID, 
            r.destination, 
            r.departureTime, 
            r.availableSeats,
            r.origin, 
            DATE_FORMAT(r.date_, '%m/%d') AS date,
            u.name AS driverName
        FROM Booking b
        JOIN Ride r ON b.rideID = r.rideID
        JOIN User u ON r.goldCardNumber = u.goldCardNumber 
        WHERE b.goldCardNumber = ? 
    `;

    const params = [goldCardNumber];

    if (status) {
        sql += " AND b.status = ?";
        params.push(status);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("SQL Error fetching user bookings:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json(results);
    });
});

// --- DELETE /bookings/:id ---
// Delete the booking created (from passenger side).
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