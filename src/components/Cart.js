import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Cart.css"; // Include CSS for Cart styles

function Cart() {
  const { state } = useLocation();
  const [cartItems, setCartItems] = useState(state?.cart || []);
  const navigate = useNavigate();

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart 🛒</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty. Start adding items!</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-description">{item.description}</p>
                  <div className="quantity-container">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item-price">${item.price * item.quantity}</p>
                  <button
                    className="remove-item-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3 className="cart-total">Total: ${calculateTotal().toFixed(2)}</h3>
            <button
              className="checkout-btn"
              onClick={() => navigate("/summary", { state: { cartItems } })}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
