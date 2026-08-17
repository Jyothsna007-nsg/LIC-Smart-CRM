import { useEffect, useState } from "react";
import api from "../services/api";
import "./Premiums.css";

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
};

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

function Premiums() {
  const [policies, setPolicies] = useState([]);
  const [payments, setPayments] = useState([]);
  const totalCollected = payments
    .filter((payment) => getPaymentStatus(payment) === "PAID")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const pendingPayments = payments.filter(
    (payment) => getPaymentStatus(payment) === "PENDING",
  ).length;

  const overduePayments = payments.filter(
    (payment) => getPaymentStatus(payment) === "OVERDUE",
  ).length;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
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
    } finally {
      setLoading(false);
    }
  };
  // ---------------------------------------------------
  // Add Payment
  // ---------------------------------------------------
  const handleAddPayment = async (e) => {
    e.preventDefault();

    if (Number(paymentForm.amount) <= 0) {
      alert("Payment amount must be greater than ₹0");
      return;
    }

    if (paymentForm.payment_status === "PAID" && !paymentForm.paid_date) {
      alert("Please select the paid date");
      return;
    }

    const paymentData = {
      ...paymentForm,
      paid_date:
        paymentForm.payment_status === "PAID" ? paymentForm.paid_date : "",
    };

    setPaymentLoading(true);

    try {
      let response;

      if (editingPayment) {
        response = await api.put(
          `/premium-payments/${editingPayment.id}`,
          paymentData,
        );
      } else {
        response = await api.post("/premium-payments", paymentData);
      }
      if (response.data.success) {
        alert(
          editingPaymentId
            ? "Premium payment updated successfully"
            : "Premium payment added successfully",
        );

        setShowPaymentModal(false);
        setEditingPayment(null);
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
  // Delete Payment
  // ---------------------------------------------------
  const handleDeletePayment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?",
    );

    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/premium-payments/${id}`);

      if (response.data.success) {
        alert("Premium payment deleted successfully");

        fetchPayments();
      }
    } catch (err) {
      console.error("Delete Payment Error:", err);

      alert("Failed to delete premium payment");
    }
  };

  // ---------------------------------------------------
  // Edit Payment
  // ---------------------------------------------------
  const handleEditPayment = (payment) => {
    setEditingPayment(payment);

    setPaymentForm({
      policy_id: payment.policy_id,
      amount: payment.amount,
      due_date: payment.due_date ? payment.due_date.split("T")[0] : "",
      paid_date: payment.paid_date ? payment.paid_date.split("T")[0] : "",
      payment_status: payment.payment_status || "PENDING",
    });

    setShowPaymentModal(true);
  };
  // ---------------------------------------------------
  // Search
  // ---------------------------------------------------
  // ---------------------------------------------------
  // Payment Search
  // ---------------------------------------------------
  const filteredPayments = payments.filter((payment) => {
    const search = searchTerm.toLowerCase();

    return (
      payment.policy_number?.toLowerCase().includes(search) ||
      payment.customer_name?.toLowerCase().includes(search) ||
      payment.policy_type?.toLowerCase().includes(search)
    );
  });

  // ---------------------------------------------------
  // Statistics
  // ---------------------------------------------------

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
          <span>Total Premium Collected</span>

          <strong>₹{totalCollected.toLocaleString("en-IN")}</strong>

          <small>Successfully paid premiums</small>
        </div>

        <div className="premium-summary-card">
          <span>Pending Payments</span>

          <strong>{pendingPayments}</strong>

          <small>Payments awaiting collection</small>
        </div>

        <div className="premium-summary-card">
          <span>Overdue Payments</span>

          <strong>{overduePayments}</strong>

          <small>Payments past due date</small>
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
        <span>{filteredPayments.length} payments</span>{" "}
      </div>

      {/* Table */}
      {/* Payment Records */}

      <div className="premiums-card">
        {loading ? (
          <div className="premium-empty">Loading payment records...</div>
        ) : filteredPayments.length === 0 ? (
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
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong>{payment.policy_number}</strong>
                    </td>

                    <td>{payment.customer_name || "-"}</td>

                    <td>{payment.policy_type || "-"}</td>

                    <td>
                      ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                    </td>

                    <td>{formatDate(payment.due_date)}</td>

                    <td>{formatDate(payment.paid_date)}</td>

                    <td>
                      {(() => {
                        const status = getPaymentStatus(payment);

                        return (
                          <span
                            className={`payment-status ${
                              status === "PAID"
                                ? "paid"
                                : status === "OVERDUE"
                                  ? "overdue"
                                  : "pending"
                            }`}
                          >
                            {status}
                          </span>
                        );
                      })()}
                    </td>
                    <td>
                      <button
                        className="edit-payment-button"
                        onClick={() => handleEditPayment(payment)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-payment-button"
                        onClick={() => handleDeletePayment(payment.id)}
                      >
                        Delete
                      </button>
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
          onClick={() => {
            setShowPaymentModal(false);
            setEditingPayment(null);
          }}
        >
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <div>
                <h3>
                  {editingPayment
                    ? "Edit Premium Payment"
                    : "Add Premium Payment"}
                </h3>

                <p>
                  {editingPayment
                    ? "Update premium payment details"
                    : "Record a customer premium payment"}
                </p>
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
                  onClick={() => {
                    setShowPaymentModal(false);
                    setEditingPayment(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-payment-button"
                  disabled={paymentLoading}
                >
                  {paymentLoading
                    ? "Saving..."
                    : editingPayment
                      ? "Update Payment"
                      : "Save Payment"}
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
