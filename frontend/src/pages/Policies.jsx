import { useEffect, useState } from "react";
import api from "../services/api";
import "./Policies.css";

function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [editForm, setEditForm] = useState({
    policy_number: "",
    policy_type: "",
    premium_amount: "",
    status: "ACTIVE",
  });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await api.get("/policies");
      setPolicies(response.data);
    } catch (err) {
      console.error("Policies Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPolicy = (policy) => {
    console.log("EDIT CLICKED:", policy);

    setEditingPolicy(policy);

    setEditForm({
      policy_number: policy.policy_number || "",
      policy_type: policy.policy_type || "",
      premium_amount: policy.premium_amount || "",
      status: policy.status || "ACTIVE",
    });
  };

  const handleUpdatePolicy = async (e) => {
    e.preventDefault();

    setEditLoading(true);

    try {
      await api.put(`/policies/${editingPolicy.id}`, editForm);

      setPolicies((prevPolicies) =>
        prevPolicies.map((policy) =>
          policy.id === editingPolicy.id
            ? {
                ...policy,
                ...editForm,
              }
            : policy,
        ),
      );

      setEditingPolicy(null);

      alert("Policy updated successfully");
    } catch (err) {
      console.error("Update Policy Error:", err);

      alert("Failed to update policy");
    } finally {
      setEditLoading(false);
    }
  };
  const handleDeletePolicy = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this policy?",
    );

    if (!confirmed) {
      return;
    }

    try {
      console.log("Deleting policy:", id);

      await api.delete(`/policies/${id}`);

      setPolicies((prevPolicies) =>
        prevPolicies.filter((policy) => policy.id !== id),
      );

      setSelectedPolicy(null);
      setEditingPolicy(null);

      alert("Policy deleted successfully");
    } catch (err) {
      console.error("Delete Policy Error:", err);

      alert(err.response?.data?.error || "Failed to delete policy");
    }
  };
  const filteredPolicies = policies.filter((policy) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      policy.policy_number?.toLowerCase().includes(search) ||
      policy.customer_name?.toLowerCase().includes(search) ||
      policy.policy_type?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && policy.status === "ACTIVE") ||
      (statusFilter === "OTHER" && policy.status !== "ACTIVE");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="policies-page">
      {/* Page Header */}
      <div className="policies-header">
        <div>
          <h2>Policies</h2>
          <p>Manage all customer insurance policies</p>
        </div>

        <button
          className="add-policy-button"
          onClick={() => {
            window.location.href = "/add-policy";
          }}
        >
          + Add Policy
        </button>
      </div>

      {/* Policy Summary */}
      <div className="policy-summary-grid">
        <div className="policy-summary-card">
          <span>Total Policies</span>
          <strong>{policies.length}</strong>
          <small>All policies</small>
        </div>

        <div className="policy-summary-card">
          <span>Active Policies</span>
          <strong>
            {policies.filter((policy) => policy.status === "ACTIVE").length}
          </strong>
          <small>Currently active</small>
        </div>

        <div className="policy-summary-card">
          <span>Other Policies</span>
          <strong>
            {policies.filter((policy) => policy.status !== "ACTIVE").length}
          </strong>
          <small>Inactive or other</small>
        </div>
      </div>

      {/* Search */}
      <div className="policies-toolbar">
        <input
          type="text"
          placeholder="Search policy number, customer or policy type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="OTHER">Other</option>
        </select>

        <span>{filteredPolicies.length} policies</span>
      </div>

      {/* Policies Table */}
      <div className="policies-card">
        {loading ? (
          <div className="policies-empty">Loading policies...</div>
        ) : filteredPolicies.length === 0 ? (
          <div className="policies-empty">No policies found.</div>
        ) : (
          <div className="policies-table-wrapper">
            <table className="policies-table">
              <thead>
                <tr>
                  <th>Policy Number</th>
                  <th>Customer</th>
                  <th>Policy Type</th>
                  <th>Premium</th>
                  <th>Start Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPolicies.map((policy) => (
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
                      {policy.start_date
                        ? new Date(policy.start_date).toLocaleDateString(
                            "en-IN",
                          )
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={`policy-status ${
                          policy.status === "ACTIVE" ? "active" : "inactive"
                        }`}
                      >
                        {policy.status || "UNKNOWN"}
                      </span>
                    </td>
                    <td>
                      <div className="policy-actions">
                        <button
                          className="view-policy-button"
                          onClick={() => setSelectedPolicy(policy)}
                        >
                          View
                        </button>

                        <button
                          className="edit-policy-button"
                          onClick={() => handleEditPolicy(policy)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-policy-button"
                          onClick={() => handleDeletePolicy(policy.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selectedPolicy && (
        <div
          className="policy-modal-overlay"
          onClick={() => setSelectedPolicy(null)}
        >
          <div className="policy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="policy-modal-header">
              <div>
                <h3>Policy Details</h3>
                <p>Complete policy information</p>
              </div>

              <button
                className="close-modal-button"
                onClick={() => setSelectedPolicy(null)}
              >
                ×
              </button>
            </div>

            <div className="policy-details">
              <div className="policy-detail-item">
                <span>Policy Number</span>
                <strong>{selectedPolicy.policy_number || "-"}</strong>
              </div>

              <div className="policy-detail-item">
                <span>Customer</span>
                <strong>{selectedPolicy.customer_name || "-"}</strong>
              </div>

              <div className="policy-detail-item">
                <span>Policy Type</span>
                <strong>{selectedPolicy.policy_type || "-"}</strong>
              </div>

              <div className="policy-detail-item">
                <span>Premium Amount</span>
                <strong>
                  ₹
                  {Number(selectedPolicy.premium_amount || 0).toLocaleString(
                    "en-IN",
                  )}
                </strong>
              </div>

              <div className="policy-detail-item">
                <span>Start Date</span>
                <strong>
                  {selectedPolicy.start_date
                    ? new Date(selectedPolicy.start_date).toLocaleDateString(
                        "en-IN",
                      )
                    : "-"}
                </strong>
              </div>

              <div className="policy-detail-item">
                <span>Status</span>

                <span
                  className={`policy-status ${
                    selectedPolicy.status === "ACTIVE" ? "active" : "inactive"
                  }`}
                >
                  {selectedPolicy.status || "UNKNOWN"}
                </span>
              </div>
            </div>

            <div className="policy-modal-footer">
              <button
                className="modal-delete-button"
                onClick={() => handleDeletePolicy(selectedPolicy.id)}
              >
                Delete Policy
              </button>

              <button
                className="modal-close-button"
                onClick={() => setSelectedPolicy(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {editingPolicy && (
        <div
          className="policy-modal-overlay"
          onClick={() => setEditingPolicy(null)}
        >
          <div className="policy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="policy-modal-header">
              <div>
                <h3>Edit Policy</h3>
                <p>Update policy information</p>
              </div>

              <button
                className="close-modal-button"
                onClick={() => setEditingPolicy(null)}
              >
                ×
              </button>
            </div>

            <form className="edit-policy-form" onSubmit={handleUpdatePolicy}>
              <div className="edit-form-group">
                <label>Policy Number</label>

                <input
                  type="text"
                  value={editForm.policy_number}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      policy_number: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="edit-form-group">
                <label>Policy Type</label>

                <input
                  type="text"
                  value={editForm.policy_type}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      policy_type: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="edit-form-group">
                <label>Premium Amount</label>

                <input
                  type="number"
                  min="0"
                  value={editForm.premium_amount}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      premium_amount: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="edit-form-group">
                <label>Status</label>

                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="policy-modal-footer">
                <button
                  type="button"
                  className="modal-close-button"
                  onClick={() => setEditingPolicy(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-policy-button"
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Policies;
