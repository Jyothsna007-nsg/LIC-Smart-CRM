const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/../.env" });

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
  } else {
    console.log("✅ MySQL Connected Successfully");
  }
});

// Home route
app.get("/", (req, res) => {
  res.send("LIC Smart CRM Backend Running 🚀");
});

// Test API route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "LIC Smart CRM API is working",
  });
});

// Customers route
app.get("/api/customers", (req, res) => {
  db.query("SELECT * FROM customers", (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
