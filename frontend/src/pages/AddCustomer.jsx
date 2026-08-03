import { useState } from "react";
import api from "../services/api";
import "./AddCustomer.css";

function AddCustomer() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    policy_type: "Jeevan Labh",
    policy_number: "",
    premium_amount: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/customers", formData);

      alert(response.data.message || "Customer added successfully!");

      setFormData({
        name: "",
        phone: "",
        email: "",
        policy_type: "Jeevan Labh",
        policy_number: "",
        premium_amount: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error adding customer");
    }
  };

  return (
    <div className="lic-page">
      <div className="lic-header">
        <div className="lic-logo">LIC</div>

        <div className="lic-title">
          <h1>LIC Smart CRM</h1>
          <p>Customer Relationship Management</p>
        </div>
      </div>

      <div className="lic-form-section">
        <div className="lic-form-card">
          <h2>Add New Customer</h2>
          <p>Register LIC customer details securely</p>

          <form onSubmit={handleSubmit}>
            <label>Customer Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter customer name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter mobile number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Policy Type</label>
            <select
              name="policy_type"
              value={formData.policy_type}
              onChange={handleChange}
              required
            >
              <option value="Jeevan Labh">Jeevan Labh</option>
              <option value="Jeevan Anand">Jeevan Anand</option>
              <option value="Jeevan Umang">Jeevan Umang</option>
              <option value="New Endowment Plan">New Endowment Plan</option>
              <option value="Money Back Policy">Money Back Policy</option>
              <option value="Term Insurance">Term Insurance</option>
            </select>

            {/* NEW POLICY NUMBER FIELD */}
            <label>Policy Number</label>
            <input
              type="text"
              name="policy_number"
              placeholder="Enter policy number"
              value={formData.policy_number}
              onChange={handleChange}
              required
            />

            <label>Premium Amount</label>
            <input
              type="number"
              name="premium_amount"
              placeholder="Enter premium amount"
              value={formData.premium_amount}
              onChange={handleChange}
            />

            <button type="submit" className="lic-save-btn">
              Save Customer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCustomer;
