const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("MySQL Connected ✅");
});

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "LIC Smart CRM Backend Running",
    time: new Date(),
  });
});

// Get all customers
app.get("/api/customers", (req, res) => {
  db.query("SELECT * FROM customers", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add customer
app.post("/api/customers", (req, res) => {
  const { name, phone, email, policyType } = req.body;

  const sql =
    "INSERT INTO customers (name, phone, email, policy_type) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, phone, email, policyType], (err, result) => {
    if (err) return res.status(500).json(err);

    ```
res.json({
  message: "Customer added successfully",
  id: result.insertId,
});
```;
  });
});

// Start Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
