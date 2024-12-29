import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css"; // Add your CSS for OrderHistory styles
import { FaArrowLeft, FaInfoCircle } from "react-icons/fa";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs.map((doc) => doc.data());
      setOrders(ordersList);
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (index) => {
    setExpandedOrder(expandedOrder === index ? null : index);
  };

  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-item">
              <div className="order-summary">
                <h3>
                  Order {index + 1} <FaInfoCircle />
                </h3>
                <button
                  className="toggle-btn"
                  onClick={() => toggleOrderDetails(index)}
                >
                  {expandedOrder === index ? "Hide Details" : "View Details"}
                </button>
              </div>
              {expandedOrder === index && (
                <div className="order-details">
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <p>Total: ${order.total}</p>
                  <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button className="back-btn" onClick={() => navigate("/")}>
        <FaArrowLeft /> Back to Menu
      </button>
    </div>
  );
}

export default OrderHistory;
