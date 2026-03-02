import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import './Orders.css'; // style this similar to Cart.css
import { useNavigate } from "react-router-dom";


const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(Cookies.get("user"));
        const email = user?.email;
        if (!email) {
          console.warn("User email not found");
          return;
        }

        const res = await axios.get(`https://buyhive-7.onrender.com/orders/${encodeURIComponent(email)}`);
        console.log("Fetched orders:", res.data);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      {/* ✅ Top Nav Bar (same as cart) */}
      <nav className="navbar">
        <div className="nav-left">
          <h2 className="logo">🛍️BuyHive</h2>
        </div>
        <div className="nav-right">
          {/*<button onClick={() => navigate("home")}>🏠 Home</button>*/}
          <button onClick={() => navigate("/home")}>🏠 Home</button>

        </div>
      </nav>

      <div className="orders-container">
        <h2>📦 My Orders</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order">
              <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <ul>
                {order.products.map((item, i) => (
                  <li key={i}>
                    {item.name} — ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
