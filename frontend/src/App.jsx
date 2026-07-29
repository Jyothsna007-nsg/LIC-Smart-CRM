import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AddCustomer from "./pages/AddCustomer";
import CustomerList from "./pages/CustomerList";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="navbar">
        <Link to="/">Add Customer</Link>
        <Link to="/customers">Customer List</Link>
      </div>

      <Routes>
        <Route path="/" element={<AddCustomer />} />
        <Route path="/customers" element={<CustomerList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
