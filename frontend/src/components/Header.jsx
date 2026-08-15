import { Search, Bell, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/customers":
        return "Customers";
      case "/add-customer":
        return "Add Customer";
      case "/policies":
        return "Policies";
      case "/add-policy":
        return "Add Policy";
      case "/premiums":
        return "Premiums";
      case "/reminders":
        return "Reminders";
      case "/reports":
        return "Reports";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="top-header">
      <div>
        <p className="breadcrumb">LIC Smart CRM /</p>
        <h1>{getPageTitle()}</h1>
      </div>

      <div className="header-actions">
        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <button className="quick-add" onClick={() => navigate("/add-customer")}>
          <Plus size={18} />
          <span>Add Customer</span>
        </button>

        <div className="header-avatar">A</div>
      </div>
    </header>
  );
}

export default Header;
