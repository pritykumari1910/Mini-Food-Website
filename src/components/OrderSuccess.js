import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "./OrderSuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="order-success-container">
      <div className="success-icon">
        <FaCheckCircle />
      </div>
      <h2>Order Placed Successfully! 🎉</h2>
      <p className="order-message">
        Thank you for your order! We're processing it and will notify you with updates shortly.
      </p>
      <div className="success-buttons">
        <button className="history-btn" onClick={() => navigate("/order-history")}>
          View Order History
        </button>
        <button className="menu-btn" onClick={() => navigate("/")}>
          Go Back to Menu
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;
