import "./CustomerDetailsModal.css";
import api from "../services/api";
function CustomerDetailsModal({ customer, policies, onClose }) {
  if (!customer) return null;

  const handleDeletePolicy = async (policyId) => {
    if (!window.confirm("Delete this policy?")) return;

    try {
      await api.delete(`/policies/${policyId}`);

      alert("Policy deleted successfully");

      // remove deleted policy from UI
      const updatedPolicies = policies.filter(
        (policy) => policy.id !== policyId,
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to delete policy");
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Customer Details</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="customer-info">
          <p>
            <strong>Name:</strong> {customer.name}
          </p>
          <p>
            <strong>Phone:</strong> {customer.phone}
          </p>
          <p>
            <strong>Email:</strong> {customer.email}
          </p>
        </div>

        <h3>Policies</h3>

        {policies.length > 0 ? (
          <table className="policy-table">
            <thead>
              <tr>
                <th>Policy Number</th>
                <th>Policy Type</th>
                <th>Premium</th>
              </tr>
            </thead>

            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td>{policy.policy_number}</td>
                  <td>{policy.policy_type}</td>
                  <td>₹{policy.premium_amount}</td>
                  <td>
                    <button
                      className="delete-policy-btn"
                      onClick={() => handleDeletePolicy(policy.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No policies found for this customer.</p>
        )}
      </div>
    </div>
  );
}

export default CustomerDetailsModal;
