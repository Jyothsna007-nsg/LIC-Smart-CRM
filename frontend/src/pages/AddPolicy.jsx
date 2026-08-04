import { useEffect, useState } from "react";
import api from "../services/api";
import "./AddPolicy.css";

function AddPolicy() {
  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    customer_id: "",
    policy_number: "",
    policy_type: "Jeevan Labh",
    premium_amount: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/policies", formData);

      alert("Policy added successfully!");

      setFormData({
        customer_id: "",
        policy_number: "",
        policy_type: "Jeevan Labh",
        premium_amount: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error adding policy");
    }
  };

  return (
    <div className="policy-page">
      <div className="policy-header">
        <p>Customers Policies Add Policy</p>
        <h1>Add New Policy</h1>
        <span>Assign LIC policies to existing customers</span>
      </div>

      <div className="policy-card">
        <div className="policy-card-title">
          <div className="policy-icon">📄</div>
          <div>
            <h2>Policy Information</h2>
            <p>Enter policy details below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="policy-form">
          <div className="form-group">
            <label>Select Customer *</label>
            <select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              required
            >
              <option value="">Choose Customer</option>

              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Policy Number *</label>
            <input
              type="text"
              name="policy_number"
              placeholder="Enter policy number"
              value={formData.policy_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Policy Type *</label>
            <select
              name="policy_type"
              value={formData.policy_type}
              onChange={handleChange}
            >
              <option>Jeevan Labh</option>
              <option>Jeevan Anand</option>
              <option>Tech Term</option>
              <option>Money Back</option>
              <option>Child Plan</option>
            </select>
          </div>

          <div className="form-group">
            <label>Premium Amount *</label>
            <input
              type="number"
              name="premium_amount"
              placeholder="Enter premium amount"
              value={formData.premium_amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="policy-buttons">
            <button
              type="button"
              className="reset-btn"
              onClick={() =>
                setFormData({
                  customer_id: "",
                  policy_number: "",
                  policy_type: "Jeevan Labh",
                  premium_amount: "",
                })
              }
            >
              Reset
            </button>

            <button type="submit" className="save-btn">
              Save Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPolicy;
