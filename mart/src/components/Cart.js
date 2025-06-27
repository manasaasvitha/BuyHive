import React from "react";
import './Cart.css';
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Cart = ({ cartItems, onUpdateQuantity, onRemoveFromCart, onClearCart, user }) => {
  console.log(cartItems);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);

  const handleUpdateQuantity = async (productId, quantity) => {
    //const user = JSON.parse(Cookies.get("user"));
    const userEmail = user?.email; // pass user down from App

    if (!userEmail || !productId) return;

    try {
      await axios.post("http://localhost:5000/cart", {
        userEmail,
        productId,
        quantity,
      });
      onUpdateQuantity(productId, quantity);
    } catch (error) {
      console.error("❌ Failed to update quantity in DB", error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    const user = JSON.parse(Cookies.get("user"));
    const userEmail = user?.email;

    if (!userEmail || !productId) {
      console.error("❌ Missing email or productId");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/cart/${userEmail}/${productId}`);
      toast.success("Item removed from cart");
      onRemoveFromCart(productId);
    } catch (err) {
      console.error("❌ Deletion failed:", err.response?.data || err.message);
      toast.error("Failed to remove item");
    }
  };

  const handlePlaceOrder = async () => {
    const user = JSON.parse(Cookies.get("user"));
    const userEmail = user?.email;
    if (!userEmail || cartItems.length === 0) return;

    //toast.info("⏳ Placing your order, please wait...");
    try {
      const response = await axios.post("http://localhost:5000/orders/place-order", {
        userEmail,
      });
     
      toast.success("🎉 Order placed successfully!");
      onClearCart();
    } catch (err) {
      console.error("❌ Order error:", err);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="cart">
      <h2>🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.productId || item._id}>
                <div>
                  <strong>{item.name}</strong><br />
                  ₹{item.price} x{" "}
                  <input
                    type="number"
                    min="1"
                    value={item.quantity || 1}
                    onChange={(e) =>
                      handleUpdateQuantity(item.productId, parseInt(e.target.value))
                    }
                  />
                  = ₹{(item.price || 0) * (item.quantity || 1)}
                </div>
                <button onClick={() => handleRemoveFromCart(item.productId)}>❌</button>
              </li>
            ))}
          </ul>
          <hr />
          <h3>Total: ₹{calculateTotal()}</h3>
        </>
      )}
      <button onClick={handlePlaceOrder} className="place-order-btn">
        ✅ Place Order
      </button>
    </div>
  );
};

export default Cart;
