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
// Get All Premiums
// ---------------------------------------------------
app.get("/api/premiums", (req, res) => {
  const sql = `
    SELECT
      p.id,
      p.policy_number,
      p.policy_type,
      p.premium_amount,
      p.start_date,
      p.status,
      c.name AS customer_name
    FROM policies p
    JOIN customers c
      ON p.customer_id = c.id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Premiums Fetch Error:", err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      data: result,
    });
  });
});

// ---------------------------------------------------
// Get Policies of a Specific Customer
// ---------------------------------------------------
app.get("/api/customers/:id/policies", (req, res) => {
  const customerId = req.params.id;

  const sql = `
    SELECT * FROM policies
    WHERE customer_id = ?
    ORDER BY id DESC
  `;

  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error(err);
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
// Update a Policy
// ---------------------------------------------------
app.put("/api/policies/:id", (req, res) => {
  const { id } = req.params;
  const { policy_number, policy_type, premium_amount, status } = req.body;

  const sql = `
    UPDATE policies
    SET
      policy_number = ?,
      policy_type = ?,
      premium_amount = ?,
      status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [policy_number, policy_type, premium_amount, status, id],
    (err, result) => {
      if (err) {
        console.error("Update Policy Error:", err);

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
        message: "Policy updated successfully",
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
// DASHBOARD APIs
// ===================================================

// ---------------------------------------------------
// Get Dashboard Statistics
// ---------------------------------------------------
app.get("/api/dashboard/stats", (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM customers) AS total_customers,

      (SELECT COUNT(*)
       FROM policies
       WHERE status = 'ACTIVE') AS active_policies,

      (SELECT COALESCE(SUM(premium_amount), 0)
       FROM policies
       WHERE MONTH(start_date) = MONTH(CURDATE())
       AND YEAR(start_date) = YEAR(CURDATE())) AS premium_this_month,

      (SELECT COUNT(*)
       FROM policies
       WHERE status != 'ACTIVE'
          OR status IS NULL) AS pending_premiums
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Dashboard Stats Error:", err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      data: result[0],
    });
  });
});

// ===================================================
// PREMIUM PAYMENTS APIs
// ===================================================

// ---------------------------------------------------
// Get All Premium Payments
// ---------------------------------------------------
app.get("/api/premium-payments", (req, res) => {
  const sql = `
    SELECT
      pp.id,
      pp.policy_id,
      pp.amount,
      pp.due_date,
      pp.paid_date,
      pp.payment_status,
      p.policy_number,
      p.policy_type,
      c.name AS customer_name
    FROM premium_payments pp
    JOIN policies p
      ON pp.policy_id = p.id
    JOIN customers c
      ON p.customer_id = c.id
    ORDER BY pp.due_date ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Premium Payments Fetch Error:", err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      data: result,
    });
  });
});

// ---------------------------------------------------
// Add Premium Payment
// ---------------------------------------------------
app.post("/api/premium-payments", (req, res) => {
  const { policy_id, amount, due_date, paid_date, payment_status } = req.body;

  const sql = `
    INSERT INTO premium_payments
    (
      policy_id,
      amount,
      due_date,
      paid_date,
      payment_status
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      policy_id,
      amount,
      due_date,
      paid_date || null,
      payment_status || "PENDING",
    ],
    (err, result) => {
      if (err) {
        console.error("Add Premium Payment Error:", err);

        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: "Premium payment added successfully",
        id: result.insertId,
      });
    },
  );
});

// ===================================================
// Start Server
// ===================================================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
