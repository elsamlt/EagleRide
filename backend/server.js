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
