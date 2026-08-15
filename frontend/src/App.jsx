import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import AddCustomer from "./pages/AddCustomer";
import CustomerList from "./pages/CustomerList";
import AddPolicy from "./pages/AddPolicy";
import Policies from "./pages/Policies";
import Premiums from "./pages/Premiums";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/customers" element={<CustomerList />} />

          <Route path="/add-customer" element={<AddCustomer />} />

          <Route path="/add-policy" element={<AddPolicy />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/premiums" element={<Premiums />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
