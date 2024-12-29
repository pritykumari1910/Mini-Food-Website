import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./Summary.css"; // Include CSS for Summary styles

function Summary() {
  const { state } = useLocation();
  const { cartItems } = state || { cartItems: [] };
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleOrderSubmit = async () => {
    try {
      const ordersCollection = collection(db, "orders");
      await addDoc(ordersCollection, {
        items: cartItems,
        total: calculateTotal(),
        date: new Date().toISOString(),
      });
      alert("Order placed successfully!");
      // Redirect to order success page after successful order placement
      navigate("/order-success");
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="summary-container">
      <h2 className="summary-title">Order Summary</h2>
      {cartItems.length === 0 ? (
        <p className="empty-summary-message">No items in your order.</p>
      ) : (
        <>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <p className="summary-item-name">{item.name} x {item.quantity}</p>
                <p className="summary-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
          </div>
          <button className="submit-order-btn" onClick={handleOrderSubmit}>
            Confirm and Place Order
          </button>
        </>
      )}
    </div>
  );
}

export default Summary;
