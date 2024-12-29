import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Summary from "./components/Summary";
import OrderSuccess from "./components/OrderSuccess"; // Import OrderSuccess
import OrderHistory from "./components/OrderHistory"; // Import OrderHistory
import AdminPanel from "./components/AdminPanel"; // Import AdminPanel
import "./App.css"; // Include CSS for global styles

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>🍴 Foodie Fiesta</h1>
          <p>Your one-stop shop for delicious food!</p>
        </header>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/order-success" element={<OrderSuccess />} /> {/* OrderSuccess page */}
          <Route path="/order-history" element={<OrderHistory />} /> {/* OrderHistory page */}
          <Route path="/admin" element={<AdminPanel />} /> {/* AdminPanel page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;