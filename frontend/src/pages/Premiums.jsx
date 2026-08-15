import { useEffect, useState } from "react";
import api from "../services/api";
import "./Premiums.css";

function Premiums() {
  const [premiums, setPremiums] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    policy_id: "",
    amount: "",
    due_date: "",
    paid_date: "",
    payment_status: "PENDING",
  });

  useEffect(() => {
    fetchPremiums();
    fetchPolicies();
    fetchPayments();
  }, []);

  // ---------------------------------------------------
  // Fetch Policies
  // ---------------------------------------------------
  const fetchPolicies = async () => {
    try {
      const response = await api.get("/policies");
      setPolicies(response.data);
    } catch (err) {
      console.error("Policies Fetch Error:", err);
    }
  };

  // ---------------------------------------------------
  // Fetch Premiums
  // ---------------------------------------------------
  const fetchPremiums = async () => {
    try {
      const response = await api.get("/premiums");

      if (response.data.success) {
        setPremiums(response.data.data);
      }
    } catch (err) {
      console.error("Premiums Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await api.get("/premium-payments");

      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (err) {
      console.error("Payments Fetch Error:", err);
    }
  };

  // ---------------------------------------------------
  // Add Payment
  // ---------------------------------------------------
  const handleAddPayment = async (e) => {
    e.preventDefault();

    setPaymentLoading(true);

    try {
      const response = await api.post("/premium-payments", paymentForm);

      if (response.data.success) {
        alert("Premium payment added successfully");

        setShowPaymentModal(false);

        setPaymentForm({
          policy_id: "",
          amount: "",
          due_date: "",
          paid_date: "",
          payment_status: "PENDING",
        });

        fetchPremiums();
        fetchPayments();
      }
    } catch (err) {
      console.error("Add Payment Error:", err);

      alert("Failed to add premium payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  // ---------------------------------------------------
  // Search
  // ---------------------------------------------------
  const filteredPremiums = premiums.filter((premium) => {
    const search = searchTerm.toLowerCase();

    return (
      premium.policy_number?.toLowerCase().includes(search) ||
      premium.customer_name?.toLowerCase().includes(search) ||
      premium.policy_type?.toLowerCase().includes(search)
    );
  });

  // ---------------------------------------------------
  // Statistics
  // ---------------------------------------------------
  const totalPremium = premiums.reduce(
    (total, premium) => total + Number(premium.premium_amount || 0),
    0,
  );

  const activePremiums = premiums.filter(
    (premium) => premium.status === "ACTIVE",
  );

  return (
    <div className="premiums-page">
      {/* Header */}
      <div className="premiums-header">
        <div>
          <h2>Premiums</h2>
          <p>Track customer premium payments</p>
        </div>

        <button
          className="add-payment-button"
          onClick={() => setShowPaymentModal(true)}
        >
          + Add Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="premium-summary-grid">
        <div className="premium-summary-card">
          <span>Total Premiums</span>

          <strong>₹{totalPremium.toLocaleString("en-IN")}</strong>

          <small>All policy premiums</small>
        </div>

        <div className="premium-summary-card">
          <span>Total Policies</span>

          <strong>{premiums.length}</strong>

          <small>Policies with premiums</small>
        </div>

        <div className="premium-summary-card">
          <span>Active Policies</span>

          <strong>{activePremiums.length}</strong>

          <small>Currently active</small>
        </div>
      </div>

      {/* Search */}
      <div className="premiums-toolbar">
        <input
          type="text"
          placeholder="Search policy, customer or policy type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span>{payments.length} payments</span>{" "}
      </div>

      {/* Table */}
      {/* Payment Records */}

      <div className="premiums-card">
        {loading ? (
          <div className="premium-empty">Loading payment records...</div>
        ) : payments.length === 0 ? (
          <div className="premium-empty">No payment records found.</div>
        ) : (
          <div className="premiums-table-wrapper">
            <table className="premiums-table">
              <thead>
                <tr>
                  <th>Policy Number</th>
                  <th>Customer</th>
                  <th>Policy Type</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                  <th>Payment Status</th>
                </tr>
              </thead>

              <tbody>
                {payments
                  .filter((payment) => {
                    const search = searchTerm.toLowerCase();

                    return (
                      payment.policy_number?.toLowerCase().includes(search) ||
                      payment.customer_name?.toLowerCase().includes(search) ||
                      payment.policy_type?.toLowerCase().includes(search)
                    );
                  })
                  .map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <strong>{payment.policy_number}</strong>
                      </td>

                      <td>{payment.customer_name || "-"}</td>

                      <td>{payment.policy_type || "-"}</td>

                      <td>
                        ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                      </td>

                      <td>
                        {payment.due_date
                          ? new Date(payment.due_date).toLocaleDateString(
                              "en-IN",
                            )
                          : "-"}
                      </td>

                      <td>
                        {payment.paid_date
                          ? new Date(payment.paid_date).toLocaleDateString(
                              "en-IN",
                            )
                          : "-"}
                      </td>

                      <td>
                        <span
                          className={`payment-status ${
                            payment.payment_status === "PAID"
                              ? "paid"
                              : payment.payment_status === "OVERDUE"
                                ? "overdue"
                                : "pending"
                          }`}
                        >
                          {payment.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Add Payment Modal */}
      {showPaymentModal && (
        <div
          className="payment-modal-overlay"
          onClick={() => setShowPaymentModal(false)}
        >
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <div>
                <h3>Add Premium Payment</h3>

                <p>Record a customer premium payment</p>
              </div>

              <button
                className="close-payment-modal"
                onClick={() => setShowPaymentModal(false)}
              >
                ×
              </button>
            </div>

            <form className="payment-form" onSubmit={handleAddPayment}>
              {/* Policy */}

              <div className="payment-form-group">
                <label>Policy</label>

                <select
                  value={paymentForm.policy_id}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      policy_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Policy</option>

                  {policies.map((policy) => (
                    <option key={policy.id} value={policy.id}>
                      {policy.policy_number} - {policy.customer_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}

              <div className="payment-form-group">
                <label>Amount</label>

                <input
                  type="number"
                  min="0"
                  placeholder="Enter premium amount"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      amount: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Due Date */}

              <div className="payment-form-group">
                <label>Due Date</label>

                <input
                  type="date"
                  value={paymentForm.due_date}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      due_date: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Payment Status */}

              <div className="payment-form-group">
                <label>Payment Status</label>

                <select
                  value={paymentForm.payment_status}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      payment_status: e.target.value,
                    })
                  }
                >
                  <option value="PENDING">Pending</option>

                  <option value="PAID">Paid</option>

                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>

              {/* Paid Date */}

              {paymentForm.payment_status === "PAID" && (
                <div className="payment-form-group">
                  <label>Paid Date</label>

                  <input
                    type="date"
                    value={paymentForm.paid_date}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paid_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              )}

              {/* Footer */}

              <div className="payment-modal-footer">
                <button
                  type="button"
                  className="cancel-payment-button"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-payment-button"
                  disabled={paymentLoading}
                >
                  {paymentLoading ? "Saving..." : "Save Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Premiums;
