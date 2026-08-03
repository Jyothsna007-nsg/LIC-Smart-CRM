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
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  // View customer details
  const viewCustomer = (customer) => {
    alert(`
Customer Name : ${customer.name}

Phone         : ${customer.phone}

Email         : ${customer.email || "N/A"}

Policy Type   : ${customer.policy_type || "N/A"}

Policy Number : ${customer.policy_number || "N/A"}

Premium Amount: ₹${customer.premium_amount || 0}
    `);
  };

  // Search by name, phone, or policy number
  const filteredCustomers = customers.filter((customer) => {
    const name = customer.name?.toLowerCase() || "";
    const phone = customer.phone || "";
    const policyNumber = customer.policy_number?.toLowerCase() || "";

    return (
      name.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      policyNumber.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="list-page">
      {/* Header */}
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

      {/* Search */}
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, phone, or policy number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Policy Type</th>
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
                    <span className="policy-type-badge">
                      {customer.policy_type || "-"}
                    </span>
                  </td>

                  <td>
                    <span className="policy-badge">
                      {customer.policy_number || "-"}
                    </span>
                  </td>

                  <td className="premium-amount">
                    ₹{customer.premium_amount || 0}
                  </td>

                  <td>
                    <div className="action-buttons">
                      {/* Working View Button */}
                      <button
                        className="view-btn"
                        onClick={() => viewCustomer(customer)}
                      >
                        View
                      </button>

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
                <td colSpan="6">
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
