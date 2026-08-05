import "./CustomerDetailsModal.css";

function CustomerDetailsModal({ customer, policies, onClose, onDeletePolicy }) {
  if (!customer) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <h2>Customer Details</h2>

        <p>
          <strong>Name:</strong> {customer.name}
        </p>
        <p>
          <strong>Phone:</strong> {customer.phone}
        </p>
        <p>
          <strong>Email:</strong> {customer.email}
        </p>

        <h3>Policies</h3>

        {policies.length === 0 ? (
          <p>No policies found.</p>
        ) : (
          <table className="policy-table">
            <thead>
              <tr>
                <th>Policy No</th>
                <th>Type</th>
                <th>Premium</th>
                <th>Action</th>
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
                      onClick={() => onDeletePolicy(policy.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CustomerDetailsModal;
