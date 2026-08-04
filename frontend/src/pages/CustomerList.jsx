import { useEffect, useState } from "react";
import api from "../services/api";
import "./CustomerList.css";
import CustomerDetailsModal from "../components/CustomerDetailsModal";
function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerPolicies, setCustomerPolicies] = useState([]);

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

  const viewCustomer = async (customer) => {
    try {
      const response = await api.get(`/customers/${customer.id}/policies`);

      setSelectedCustomer(customer);
      setCustomerPolicies(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm("Delete this customer?")) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error(error);
        alert("Failed to delete customer");
      }
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  );

  return (
    <div className="customer-list-page">
      <div className="list-header">
        <p className="breadcrumb">Customers Customer List</p>
        <h1>Customer Management</h1>
        <p className="subtitle">
          Manage customer records and LIC policy relationships
        </p>
      </div>

      <div className="list-top-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by customer name or phone number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="customer-count-card">
          <span>Total Customers</span>
          <h2>{customers.length}</h2>
        </div>
      </div>

      <div className="customer-table-card">
        <div className="table-card-header">
          <div className="table-icon">👥</div>
          <div>
            <h2>Customer Records</h2>
            <p>View and manage registered customers</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="customer-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Email Address</th>
                <th>Policies</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="customer-name-cell">
                      <div className="customer-avatar">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <strong>{customer.name}</strong>
                        <small>LIC Customer ID #{customer.id}</small>
                      </div>
                    </td>

                    <td>{customer.phone}</td>
                    <td>{customer.email || "Not provided"}</td>

                    <td>
                      <span className="policy-badge">
                        {customer.policy_count}
                        {customer.policy_count == 1 ? " Policy" : " Policies"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
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
                  <td colSpan="5" className="empty-state">
                    No customers found
                  </td>
                </tr>
              )}
              {selectedCustomer && (
                <CustomerDetailsModal
                  customer={selectedCustomer}
                  policies={customerPolicies}
                  onClose={() => setSelectedCustomer(null)}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerList;
