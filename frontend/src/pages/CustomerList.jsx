import { useEffect, useState } from "react";
import api from "../services/api";
import "./CustomerList.css";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  );

  return (
    <div className="list-page">
      <div className="list-header">
        <div className="header-left">
          <h1>LIC Customer Management</h1>
          <p>Manage customer records and policy details.</p>
        </div>

        <div className="total-card">
          <span>Total Customers</span>
          <strong>{customers.length}</strong>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-card">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Policy Number</th>
              <th>Premium Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="customer-name">{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <span className="policy-badge">
                      {customer.policy_number}
                    </span>
                  </td>
                  <td className="premium-amount">₹{customer.premium_amount}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn">View</button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteCustomer(customer.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <h3>No Customers Found</h3>
                    <p>Add your first LIC customer to get started.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerList;
