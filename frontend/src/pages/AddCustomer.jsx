import { useState } from "react";
import api from "../services/api";
import "./AddCustomer.css";

function AddCustomer() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
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
      await api.post("/customers", formData);

      alert("Customer added successfully!");

      setFormData({
        name: "",
        phone: "",
        email: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error adding customer");
    }
  };

  return (
    <div className="add-customer-page">
      <div className="page-header">
        <p className="breadcrumb">Customers Add Customer</p>
        <h1>Add New Customer</h1>
        <p className="subtitle">Enter customer details to get started</p>
      </div>

      <div className="customer-layout">
        <div className="lic-info-card">
          <div className="lic-icon">🛡️</div>
          <h3>Customer First</h3>
          <p>
            Accurate customer information helps us serve better and build
            stronger relationships.
          </p>

          <div className="lic-footer-text">
            <span>Har Pal Aapke Saath</span>
            <small>Zindagi ke saath bhi, Zindagi ke baad bhi.</small>
          </div>
        </div>

        <div className="customer-form-card">
          <div className="form-badge">+</div>

          <h2>Customer Information</h2>

          <form onSubmit={handleSubmit} className="customer-form">
            <div className="form-group">
              <label>Customer Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter 10 digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="button-group">
              <button
                type="button"
                className="reset-btn"
                onClick={() =>
                  setFormData({
                    name: "",
                    phone: "",
                    email: "",
                  })
                }
              >
                Reset
              </button>

              <button type="submit" className="save-btn">
                Save Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCustomer;
