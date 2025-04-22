const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(express.json());

const ORS_API_KEY = "5b3ce3597851110001cf624896c33a9d3a2341c8b17fd3d64e302951";

// Database connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "route_app", // Change this to your database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to the database.");
});

const DELTA = 0.02; // ~2.2km radius for matching updates

// Route Optimization API Endpoint
app.post("/api/route", async (req, res) => {
  const { source, destination } = req.body;
  try {
    const response = await axios.post(
      `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
      {
        coordinates: [source, destination],
      },
      {
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Route calculation failed", error: err.message });
  }
});

// Get route updates near coordinates
app.get("/api/route-updates", (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and Longitude are required" });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  const latMin = latitude - DELTA;
  const latMax = latitude + DELTA;
  const lngMin = longitude - DELTA;
  const lngMax = longitude + DELTA;

  const query = `
    SELECT id, message, latitude, longitude, created_at
    FROM route_updates
    WHERE latitude BETWEEN ? AND ?
    AND longitude BETWEEN ? AND ?
    ORDER BY created_at DESC
  `;

  db.query(query, [latMin, latMax, lngMin, lngMax], (err, results) => {
    if (err) {
      console.error("Error fetching updates:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});

app.post('/api/submit-update', (req, res) => {
  const { message, latitude, longitude } = req.body;

  // Check if all fields are provided
  if (!message || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // SQL query to insert the update into the database
  const query = 'INSERT INTO route_updates (message, latitude, longitude) VALUES (?, ?, ?)';
  db.query(query, [message, latitude, longitude], (err, result) => {
    if (err) {
      console.error('Error inserting update:', err);
      return res.status(500).json({ message: 'Error saving update' });
    }
    res.status(200).json({ message: 'Update submitted successfully' });
  });
});

app.get("/api/admin/status-check", async (req, res) => {
  try {
    // Dummy check for demonstration; replace with real API checks
    res.json({
      getCoordinates: "OK",
      getRoute: "OK",
      getWeather: "OK",
      database: "OK"
    });
  } catch (err) {
    res.status(500).json({ error: "Status check failed" });
  }
});

app.get("/api/route-updates", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM route_updates ORDER BY timestamp DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch route updates" });
  }
});

app.delete("/api/route-updates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM route_updates WHERE id = ?", [id]);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete update" });
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));
