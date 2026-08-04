const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/../.env" });

const app = express();

// ---------------------------------------------------
// Middleware
// ---------------------------------------------------
app.use(cors());
app.use(express.json());

// ---------------------------------------------------
// MySQL Connection
// ---------------------------------------------------
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
});

// ---------------------------------------------------
// Connect to MySQL
// ---------------------------------------------------
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

// ===================================================
// CUSTOMERS APIs
// ===================================================

// ---------------------------------------------------
// Get All Customers WITH Policy Count
// ---------------------------------------------------
app.get("/api/customers", (req, res) => {
  const sql = `
    SELECT
      customers.id,
      customers.name,
      customers.phone,
      customers.email,
      COUNT(policies.id) AS policy_count
    FROM customers
    LEFT JOIN policies
      ON customers.id = policies.customer_id
    GROUP BY customers.id
    ORDER BY customers.id DESC
  `;

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
app.post("/api/customers", (req, res) => {
  const { name, phone, email } = req.body;

  const sql = `
    INSERT INTO customers (name, phone, email)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, phone, email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to add customer" });
    }

    res.json({
      message: "Customer added successfully",
      id: result.insertId,
    });
  });
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

// ===================================================
// POLICIES APIs
// ===================================================

// ---------------------------------------------------
// Get All Policies
// ---------------------------------------------------
app.get("/api/policies", (req, res) => {
  const sql = `
    SELECT 
      p.*, 
      c.name AS customer_name
    FROM policies p
    JOIN customers c ON p.customer_id = c.id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Policy Fetch Error:", err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json(result);
  });
});

// ---------------------------------------------------
// Get Policies of a Specific Customer
// ---------------------------------------------------
app.get("/api/customers/:id/policies", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT * FROM policies
    WHERE customer_id = ?
    ORDER BY id DESC
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Policy Fetch Error:", err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json(result);
  });
});

// ---------------------------------------------------
// Add Policy
// ---------------------------------------------------
app.post("/api/policies", (req, res) => {
  const { customer_id, policy_number, policy_type, premium_amount } = req.body;

  const sql = `
    INSERT INTO policies
    (customer_id, policy_number, policy_type, premium_amount)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [customer_id, policy_number, policy_type, premium_amount],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: "Failed to add policy",
          details: err.message,
        });
      }

      res.json({
        message: "Policy added successfully",
        id: result.insertId,
      });
    },
  );
});

// ---------------------------------------------------
// Delete a Particular Policy
// ---------------------------------------------------
app.delete("/api/policies/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM policies WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete Policy Error:", err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    res.json({
      success: true,
      message: "Policy deleted successfully",
    });
  });
});

// ===================================================
// Start Server
// ===================================================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
