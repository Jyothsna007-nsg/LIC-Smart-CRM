import { useState } from "react";
import api from "../services/api";
import "./AddCustomer.css";

export default function AddCustomer() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    policyType: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()```
try {
  await api.post('/customers', form)

  alert('Customer Added Successfully ✅')

  setForm({
    name: '',
    phone: '',
    email: '',
    policyType: ''
  })
} catch (error) {
  console.error(error)
  alert('Failed to add customer ❌')
}
```;
  };

  return (
    <div className="page-container">
      {" "}
      <div className="navbar">
        {" "}
        <div className="logo-section">
          {" "}
          <div className="logo-circle">LIC</div>{" "}
          <div>
            {" "}
            <h1>LIC Smart CRM</h1> <p>Customer Relationship Management</p>{" "}
          </div>{" "}
        </div>{" "}
      </div>
      ```
      <div className="form-wrapper">
        <div className="form-card">
          <div className="form-header">
            <h2>Add New Customer</h2>
            <p>Register LIC customer details securely</p>
          </div>

          <form onSubmit={handleSubmit} className="customer-form">
            <div className="input-group">
              <label>Customer Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter customer name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter mobile number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Policy Type</label>
              <select
                name="policyType"
                value={form.policyType}
                onChange={handleChange}
                required
              >
                <option value="">Select Policy</option>
                <option value="LIC Jeevan Anand">LIC Jeevan Anand</option>
                <option value="LIC New Endowment Plan">
                  LIC New Endowment Plan
                </option>
                <option value="LIC Tech Term">LIC Tech Term</option>
                <option value="LIC Jeevan Labh">LIC Jeevan Labh</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">
              Save Customer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
