import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import "./AdminPanel.css";

function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5; // Number of orders per page
  const [sortOption, setSortOption] = useState("date");
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          orderBy("date", "desc") // Default sort by date
        );
        onSnapshot(ordersQuery, (snapshot) => {
          const ordersList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersList);
          setFilteredOrders(ordersList);
          setLoading(false);
        });
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  // Sorting logic
  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSortOption(sortValue);
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      if (sortValue === "date") {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortValue === "total") {
        return b.total - a.total;
      }
      return 0;
    });
    setFilteredOrders(sortedOrders);
  };

  // Modal logic
  const openModal = (order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setFilteredOrders(filteredOrders.filter((order) => order.id !== orderId));
      alert("Order deleted successfully.");
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete the order. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="admin-panel-container">
      <h2>Admin Panel</h2>

      {/* Sorting Options */}
      <div className="sort-options">
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="date">Date</option>
          <option value="total">Total Amount</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="orders-list">
          {currentOrders.map((order, index) => (
            <div key={order.id} className="order-item">
              <h3>Order {indexOfFirstOrder + index + 1}</h3>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Total:</strong> ${order.total.toFixed(2)}
              </p>
              <p>
                <strong>Date:</strong> {new Date(order.date).toLocaleString()}
              </p>
              <div className="order-actions">
                <button className="details-btn" onClick={() => openModal(order)}>
                  View Details
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteOrder(order.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => handlePageChange(page + 1)}
            className={currentPage === page + 1 ? "active" : ""}
          >
            {page + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h3>Order Details</h3>
            <ul>
              {selectedOrder.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity} (${item.price.toFixed(2)})
                </li>
              ))}
            </ul>
            <p>
              <strong>Total:</strong> ${selectedOrder.total.toFixed(2)}
            </p>
            <p>
              <strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}
            </p>
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
