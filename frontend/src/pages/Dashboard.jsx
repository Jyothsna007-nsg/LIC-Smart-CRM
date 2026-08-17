import { useEffect, useState } from "react";
import api from "../services/api";
import "./Dashboard.css";

const getPaymentStatus = (payment) => {
  if (payment.payment_status === "PAID") {
    return "PAID";
  }

  if (payment.payment_status === "PENDING" && payment.due_date) {
    const today = new Date();
    const dueDate = new Date(payment.due_date);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      return "OVERDUE";
    }
  }

  return payment.payment_status || "PENDING";
};

function Dashboard() {
  const [stats, setStats] = useState({
    total_customers: 0,
    active_policies: 0,
    premium_this_month: 0,
    pending_premiums: 0,
    overdue_payments: 0,
    premium_collected: 0,
  });

  const [customers, setCustomers] = useState([]);

  const [policies, setPolicies] = useState([]);
  const [policiesLoading, setPoliciesLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentCustomers();
    fetchPolicies();
    fetchPayments();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error("Dashboard Stats Error:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentCustomers = async () => {
    try {
      const response = await api.get("/customers");

      // API already returns customers ordered by id DESC
      setCustomers(response.data.slice(0, 5));
    } catch (err) {
      console.error("Recent Customers Error:", err);
    } finally {
      setCustomersLoading(false);
    }
  };

  const fetchPolicies = async () => {
    try {
      const response = await api.get("/policies");

      setPolicies(response.data);
    } catch (err) {
      console.error("Policies Fetch Error:", err);
    } finally {
      setPoliciesLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await api.get("/premium-payments");

      if (response.data.success) {
        setPayments(response.data.data.slice(0, 5));
      }
    } catch (err) {
      console.error("Recent Payments Error:", err);
    } finally {
      setPaymentsLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Welcome */}
      <div className="dashboard-welcome">
        <div>
          <h2>Welcome back, Agent</h2>
          <p>Here's what's happening with your customers today.</p>
        </div>
      </div>

      {/* Error */}
      {error && <div className="dashboard-error">{error}</div>}

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Customers</span>
          <strong>{loading ? "..." : stats.total_customers}</strong>
          <small>Registered customers</small>
        </div>

        <div className="stat-card">
          <span>Active Policies</span>
          <strong>{loading ? "..." : stats.active_policies}</strong>
          <small>Currently active</small>
        </div>

        <div className="stat-card">
          <span>Premium This Month</span>
          <strong>
            {loading
              ? "..."
              : `₹${Number(stats.premium_this_month).toLocaleString("en-IN")}`}
          </strong>
          <small>Based on policy start dates</small>
        </div>

        <div
          className="stat-card stat-card-clickable"
          onClick={() => {
            window.location.href = "/premiums";
          }}
        >
          {" "}
          <span>Pending Premiums</span>
          <strong>{loading ? "..." : stats.pending_premiums}</strong>
          <small>Awaiting premium collection</small>{" "}
        </div>
        <div className="stat-card">
          <span>Premium Collected</span>
          <strong>
            {loading
              ? "..."
              : `₹${Number(stats.premium_collected || 0).toLocaleString("en-IN")}`}
          </strong>
          <small>Total paid premium amount</small>
        </div>
        <div
          className="stat-card stat-card-clickable"
          onClick={() => {
            window.location.href = "/premiums";
          }}
        >
          {" "}
          <span>Overdue Payments</span>
          <strong>{loading ? "..." : stats.overdue_payments}</strong>
          <small>Payments past due date</small>
        </div>
      </div>

      {/* Recent Customers */}
      <div className="recent-customers">
        <div className="section-header">
          <div>
            <h3>Recent Customers</h3>
            <p>Latest customers added to your CRM</p>
          </div>

          <button
            className="view-all-button"
            onClick={() => {
              window.location.href = "/customers";
            }}
          >
            View All
          </button>
        </div>

        {customersLoading ? (
          <div className="empty-state">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="empty-state">No customers found.</div>
        ) : (
          <div className="customer-table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Policies</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-name">
                        <div className="customer-avatar">
                          {customer.name
                            ? customer.name.charAt(0).toUpperCase()
                            : "C"}
                        </div>

                        <span>{customer.name}</span>
                      </div>
                    </td>

                    <td>{customer.phone || "-"}</td>

                    <td>{customer.email || "-"}</td>

                    <td>
                      <span className="policy-badge">
                        {customer.policy_count || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions + Policy Overview */}
      <div className="dashboard-bottom-grid">
        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Common tasks</p>
            </div>
          </div>

          <div className="quick-actions">
            <button
              onClick={() => {
                window.location.href = "/add-customer";
              }}
            >
              <span className="quick-action-icon">+</span>
              <span>Add Customer</span>
            </button>

            <button
              onClick={() => {
                window.location.href = "/add-policy";
              }}
            >
              <span className="quick-action-icon">+</span>
              <span>Add Policy</span>
            </button>

            <button
              onClick={() => {
                window.location.href = "/customers";
              }}
            >
              <span className="quick-action-icon">👥</span>
              <span>View Customers</span>
            </button>

            <button
              onClick={() => {
                window.location.href = "/policies";
              }}
            >
              <span className="quick-action-icon">📄</span>
              <span>View Policies</span>
            </button>
          </div>
        </div>

        {/* Policy Overview */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h3>Policy Overview</h3>
              <p>Current policy summary</p>
            </div>
          </div>

          {policiesLoading ? (
            <div className="empty-state">Loading policies...</div>
          ) : (
            <div className="policy-overview">
              <div className="policy-overview-row">
                <span>Active Policies</span>

                <strong>
                  {
                    policies.filter((policy) => policy.status === "ACTIVE")
                      .length
                  }
                </strong>
              </div>

              <div className="policy-overview-row">
                <span>Other Policies</span>

                <strong>
                  {
                    policies.filter((policy) => policy.status !== "ACTIVE")
                      .length
                  }
                </strong>
              </div>

              <div className="policy-overview-row total">
                <span>Total Policies</span>

                <strong>{policies.length}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Recent Policies */}
      <div className="recent-policies">
        <div className="section-header">
          <div>
            <h3>Recent Policies</h3>
            <p>Latest policies added to your CRM</p>
          </div>

          <button
            className="view-all-button"
            onClick={() => {
              window.location.href = "/policies";
            }}
          >
            View All
          </button>
        </div>

        {policiesLoading ? (
          <div className="empty-state">Loading policies...</div>
        ) : policies.length === 0 ? (
          <div className="empty-state">No policies found.</div>
        ) : (
          <div className="policy-table-wrapper">
            <table className="policy-table">
              <thead>
                <tr>
                  <th>Policy Number</th>
                  <th>Customer</th>
                  <th>Policy Type</th>
                  <th>Premium</th>
                  <th>Status</th>
                  <th>Start Date</th>
                </tr>
              </thead>

              <tbody>
                {policies.slice(0, 5).map((policy) => (
                  <tr key={policy.id}>
                    <td>
                      <strong className="policy-number">
                        {policy.policy_number}
                      </strong>
                    </td>

                    <td>{policy.customer_name || "-"}</td>

                    <td>{policy.policy_type || "-"}</td>

                    <td>
                      ₹
                      {Number(policy.premium_amount || 0).toLocaleString(
                        "en-IN",
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          policy.status === "ACTIVE"
                            ? "status-active"
                            : "status-other"
                        }`}
                      >
                        {policy.status || "UNKNOWN"}
                      </span>
                    </td>

                    <td>
                      {policy.start_date
                        ? new Date(policy.start_date).toLocaleDateString(
                            "en-IN",
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Recent Premium Payments */}
      <div className="recent-payments">
        <div className="section-header">
          <div>
            <h3>Recent Premium Payments</h3>
            <p>Latest premium payment activity</p>
          </div>

          <button
            className="view-all-button"
            onClick={() => {
              window.location.href = "/premiums";
            }}
          >
            View All
          </button>
        </div>

        {paymentsLoading ? (
          <div className="empty-state">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="empty-state">No payment records found.</div>
        ) : (
          <div className="payment-table-wrapper">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Policy Number</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong className="policy-number">
                        {payment.policy_number}
                      </strong>
                    </td>

                    <td>{payment.customer_name || "-"}</td>

                    <td>
                      ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {payment.due_date
                        ? new Date(payment.due_date).toLocaleDateString(
                            "en-IN",
                            {
                              timeZone: "UTC",
                            },
                          )
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={`payment-status ${
                          getPaymentStatus(payment) === "PAID"
                            ? "paid"
                            : getPaymentStatus(payment) === "OVERDUE"
                              ? "overdue"
                              : "pending"
                        }`}
                      >
                        {getPaymentStatus(payment)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
