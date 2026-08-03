const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/../.env" });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ MySQL Connected Successfully");
  }
});

// ---------------------------------------------------
// Home Route
// ---------------------------------------------------
app.get("/", (req, res) => {
  res.send("LIC Smart CRM Backend Running 🚀");
});

// ---------------------------------------------------
// Test API
// ---------------------------------------------------
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "LIC Smart CRM API is working",
  });
});

// ---------------------------------------------------
// Get All Customers
// ---------------------------------------------------
app.get("/api/customers", (req, res) => {
  const sql = "SELECT * FROM customers ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Fetch Error:", err);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json(result);
  });
});

// ---------------------------------------------------
// Add Customer
// ---------------------------------------------------
// Add Customer
app.post("/api/customers", (req, res) => {
  const { name, phone, email, policy_type, policy_number, premium_amount } =
    req.body;

  const sql = `
    INSERT INTO customers
    (name, phone, email, policy_type, policy_number, premium_amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, phone, email, policy_type, policy_number, premium_amount],
    (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        success: true,
        message: "Customer added successfully",
        customerId: result.insertId,
      });
    },
  );
});

// ---------------------------------------------------
// Delete Customer
// ---------------------------------------------------
app.delete("/api/customers/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM customers WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete Error:", err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  });
});

// ---------------------------------------------------
// Start Server
// ---------------------------------------------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
