import { useEffect, useState } from "react";
import api from "../services/api";
import "./Reminders.css";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: "",
    policy_id: "",
    reminder_type: "PREMIUM",
    reminder_date: "",
    message: "",
    status: "PENDING",
  });

  useEffect(() => {
    fetchReminders();
    fetchCustomers();
    fetchPolicies();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await api.get("/reminders");

      if (response.data.success) {
        setReminders(response.data.data);
      }
    } catch (error) {
      console.error("Reminders Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Customers Fetch Error:", error);
    }
  };

  const fetchPolicies = async () => {
    try {
      const response = await api.get("/policies");
      setPolicies(response.data);
    } catch (error) {
      console.error("Policies Fetch Error:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: "",
      policy_id: "",
      reminder_type: "PREMIUM",
      reminder_date: "",
      message: "",
      status: "PENDING",
    });

    setEditingReminder(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);

    setFormData({
      customer_id: reminder.customer_id || "",
      policy_id: reminder.policy_id || "",
      reminder_type: reminder.reminder_type || "PREMIUM",
      reminder_date: reminder.reminder_date
        ? reminder.reminder_date.split("T")[0]
        : "",
      message: reminder.message || "",
      status: reminder.status || "PENDING",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      let response;

      if (editingReminder) {
        response = await api.put(`/reminders/${editingReminder.id}`, formData);
      } else {
        response = await api.post("/reminders", formData);
      }

      if (response.data.success) {
        alert(
          editingReminder
            ? "Reminder updated successfully"
            : "Reminder added successfully",
        );

        setShowModal(false);
        resetForm();
        fetchReminders();
      }
    } catch (error) {
      console.error("Reminder Save Error:", error);

      alert(error.response?.data?.error || "Failed to save reminder");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reminder?")) {
      return;
    }

    try {
      const response = await api.delete(`/reminders/${id}`);

      if (response.data.success) {
        alert("Reminder deleted successfully");
        fetchReminders();
      }
    } catch (error) {
      console.error("Reminder Delete Error:", error);

      alert("Failed to delete reminder");
    }
  };

  const getReminderStatus = (reminder) => {
    if (reminder.status === "COMPLETED") {
      return "COMPLETED";
    }

    const today = new Date();
    const reminderDate = new Date(reminder.reminder_date);

    today.setHours(0, 0, 0, 0);
    reminderDate.setHours(0, 0, 0, 0);

    if (reminderDate < today) {
      return "OVERDUE";
    }

    if (reminderDate.getTime() === today.getTime()) {
      return "TODAY";
    }

    return "UPCOMING";
  };

  const filteredReminders = reminders.filter((reminder) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      reminder.customer_name?.toLowerCase().includes(search) ||
      reminder.policy_number?.toLowerCase().includes(search) ||
      reminder.reminder_type?.toLowerCase().includes(search);

    const status = getReminderStatus(reminder);

    const matchesStatus = statusFilter === "ALL" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="reminders-page">
      <div className="reminders-header">
        <div>
          <h2>Reminders</h2>
          <p>Manage customer and premium reminders</p>
        </div>

        <button className="add-reminder-button" onClick={openAddModal}>
          + Add Reminder
        </button>
      </div>

      <div className="reminder-summary-grid">
        <div className="reminder-summary-card">
          <span>Total Reminders</span>
          <strong>{reminders.length}</strong>
          <small>All reminders</small>
        </div>

        <div className="reminder-summary-card">
          <span>Upcoming</span>
          <strong>
            {
              reminders.filter((r) => getReminderStatus(r) === "UPCOMING")
                .length
            }
          </strong>
          <small>Future reminders</small>
        </div>

        <div className="reminder-summary-card">
          <span>Today</span>
          <strong>
            {reminders.filter((r) => getReminderStatus(r) === "TODAY").length}
          </strong>
          <small>Due today</small>
        </div>

        <div className="reminder-summary-card">
          <span>Overdue</span>
          <strong>
            {reminders.filter((r) => getReminderStatus(r) === "OVERDUE").length}
          </strong>
          <small>Past reminder date</small>
        </div>
      </div>
      <div className="reminder-form-group">
        <label>Status</label>

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      <div className="reminders-toolbar">
        <input
          type="text"
          placeholder="Search customer, policy or reminder type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="TODAY">Today</option>
          <option value="OVERDUE">Overdue</option>
        </select>

        <span>{filteredReminders.length} reminders</span>
      </div>

      <div className="reminders-card">
        {loading ? (
          <div className="reminder-empty">Loading reminders...</div>
        ) : filteredReminders.length === 0 ? (
          <div className="reminder-empty">No reminders found.</div>
        ) : (
          <div className="reminders-table-wrapper">
            <table className="reminders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Policy Number</th>
                  <th>Reminder Type</th>
                  <th>Reminder Date</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredReminders.map((reminder) => {
                  const status = getReminderStatus(reminder);

                  return (
                    <tr key={reminder.id}>
                      <td>{reminder.customer_name || "-"}</td>

                      <td>{reminder.policy_number || "-"}</td>

                      <td>{reminder.reminder_type || "-"}</td>

                      <td>
                        {reminder.reminder_date
                          ? new Date(reminder.reminder_date).toLocaleDateString(
                              "en-IN",
                              {
                                timeZone: "UTC",
                              },
                            )
                          : "-"}
                      </td>

                      <td>{reminder.message || "-"}</td>

                      <td>
                        <span
                          className={`reminder-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <div className="reminder-actions">
                          <button
                            className="edit-reminder-button"
                            onClick={() => handleEdit(reminder)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-reminder-button"
                            onClick={() => handleDelete(reminder.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="reminder-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div className="reminder-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reminder-modal-header">
              <div>
                <h3>{editingReminder ? "Edit Reminder" : "Add Reminder"}</h3>

                <p>
                  {editingReminder
                    ? "Update reminder details"
                    : "Create a new customer reminder"}
                </p>
              </div>

              <button
                className="close-reminder-modal"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form className="reminder-form" onSubmit={handleSubmit}>
              <div className="reminder-form-group">
                <label>Customer</label>

                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Customer</option>

                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="reminder-form-group">
                <label>Policy</label>

                <select
                  name="policy_id"
                  value={formData.policy_id}
                  onChange={handleChange}
                >
                  <option value="">Select Policy</option>

                  {policies.map((policy) => (
                    <option key={policy.id} value={policy.id}>
                      {policy.policy_number} - {policy.customer_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="reminder-form-group">
                <label>Reminder Type</label>

                <select
                  name="reminder_type"
                  value={formData.reminder_type}
                  onChange={handleChange}
                >
                  <option value="PREMIUM">Premium Payment</option>
                  <option value="POLICY_RENEWAL">Policy Renewal</option>
                  <option value="FOLLOW_UP">Customer Follow-up</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="reminder-form-group">
                <label>Reminder Date</label>

                <input
                  type="date"
                  name="reminder_date"
                  value={formData.reminder_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="reminder-form-group">
                <label>Message</label>

                <textarea
                  name="message"
                  placeholder="Enter reminder message..."
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="reminder-modal-footer">
                <button
                  type="button"
                  className="cancel-reminder-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-reminder-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingReminder
                      ? "Update Reminder"
                      : "Save Reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reminders;
