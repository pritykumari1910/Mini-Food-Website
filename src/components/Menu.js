import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Menu.css"; // Ensure styles are added in this file

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const menuCollection = collection(db, "menu");
        const menuSnapshot = await getDocs(menuCollection);
        const menuList = menuSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenuItems(menuList);
        setFilteredItems(menuList);

        const uniqueCategories = ["All", ...new Set(menuList.map((item) => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    setFilteredItems(
      category === "All"
        ? menuItems
        : menuItems.filter((item) => item.category === category)
    );
  };

  const addToCart = (item) => {
    const itemInCart = cart.find((cartItem) => cartItem.id === item.id);

    if (itemInCart) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    setSuccessMessage("Item added to cart!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="menu-container">
      <h2 className="menu-title">Explore Our Menu</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}

      {loading ? (
        <div className="loading">Loading menu items...</div>
      ) : (
        <>
          {/* Category Filter */}
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => filterByCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="menu-item">
                <img src={item.image || "placeholder.png"} alt={item.name || "Item"} className="menu-image" />
                <h3 className="menu-item-title">{item.name || "Unnamed Item"}</h3>
                <p className="menu-item-description">
                  {item.description || "No description available"}
                </p>
                <p className="menu-price">${item.price || "0.00"}</p>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer Buttons */}
      <div className="footer-btn-container">
        <button
          className="go-to-cart-btn"
          onClick={() => navigate("/cart", { state: { cart } })}
        >
          Review Cart 🛒
        </button>

        <div className="navigation-btn-container">
          <button
            className="go-to-order-success-btn"
            onClick={() => navigate("/order-success")}
          >
            Place Order
          </button>
          <button
            className="go-to-order-history-btn"
            onClick={() => navigate("/order-history")}
          >
            View Order History
          </button>
          <button
            className="go-to-admin-btn"
            onClick={() => navigate("/admin")}
          >
            Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menu;
