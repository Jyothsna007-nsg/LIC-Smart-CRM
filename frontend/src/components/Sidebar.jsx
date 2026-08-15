import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Wallet,
  Bell,
  BarChart3,
  Settings,
  UserPlus,
  FilePlus,
} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Add Customer",
      path: "/add-customer",
      icon: UserPlus,
    },
    {
      name: "Policies",
      path: "/policies",
      icon: FileText,
    },
    {
      name: "Add Policy",
      path: "/add-policy",
      icon: FilePlus,
    },
    {
      name: "Premiums",
      path: "/premiums",
      icon: Wallet,
    },
    {
      name: "Reminders",
      path: "/reminders",
      icon: Bell,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">LIC</div>

        <div>
          <h2>LIC Smart CRM</h2>
          <span>Customer Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-title">MAIN MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="agent-avatar">A</div>

        <div>
          <strong>LIC Agent</strong>
          <span>Agent Portal</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
