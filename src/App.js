import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate
} from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import MiniMart from "./components/MiniMart";
import MyOrders from "./components/MyOrders";
import ProductDetail from "./components/ProductDetail";
import { ToastContainer } from "react-toastify";
import "./index.css";
import Cookies from "js-cookie";
import axios from "axios";

// ========== AppRoutes Component ==========
const AppRoutes = ({ user, setUser, cart, setCart, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  // Load cart from backend when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.email) return;

      try {
        const response = await axios.get(
          `https://buyhive-7.onrender.com/cart/${encodeURIComponent(user.email)}`
        );

        const cartItemsFromDB = response.data.cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "",
        }));

        setCart(cartItemsFromDB);
      } catch (err) {
        console.error("❌ Failed to load cart from DB", err);
      }
    };

    fetchCart();
  }, [user, setCart]);

  // Add item to cart
  const handleAddToCart = async (product) => {
    const existingItem = cart.find((item) => item.productId === product._id);

    const updatedCart = existingItem
      ? cart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { ...product, productId: product._id, quantity: 1 }];

    setCart(updatedCart);

    if (!user?.email) return;

    try {
      await axios.post("https://buyhive-7.onrender.com/cart", {
        userEmail: user.email,
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: existingItem ? existingItem.quantity + 1 : 1,
        image: product.image,
      });
    } catch (err) {
      console.error("Add to cart error", err);
    }
  };

  // Update quantity of a cart item
  const handleUpdateQuantity = async (productId, quantity) => {
    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);

    if (!user?.email) return;

    try {
      await axios.post("https://buyhive-7.onrender.com/cart", {
        userEmail: user.email,
        productId,
        quantity
      });
    } catch (err) {
      console.error("Update cart item error", err);
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = async (productId) => {
    if (!user?.email) return;

    try {
      await axios.delete(
      `https://buyhive-7.onrender.com/cart/${encodeURIComponent(user.email)}/${productId}`
      );
      
      setCart(cart.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error("Delete cart item error", err);
    }
  };

  // Clear cart completely
  const handleClearCart = async () => {
    if (!user?.email) return;

    try {
      await axios.delete(
        `https://buyhive-7.onrender.com/cart/all/${encodeURIComponent(user.email)}`
      );
      setCart([]);
    } catch (err) {
      console.error("Clear cart error", err);
    }
  };

  // Logout user
  const handleLogout = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        await axios.post("https://buyhive-7.onrender.com/logout", { token });
      } catch (err) {
        console.error("Logout API error", err);
      }
    }
    Cookies.remove("user");
    Cookies.remove("token");
    setUser(null);
    setCart([]);
    navigate("/");
  };

  // Handle login/signup
  const handleLoginOrSignup = (u) => {
    setUser(u);

    // Save user info
    Cookies.set("user", JSON.stringify({ name: u.name, email: u.email }), {
      expires: 30,
      secure: true,
      sameSite: "Strict"
    });

    // Save token if present
    if (u.token) {
      Cookies.set("token", u.token, {
        expires: 30,
        secure: true,
        sameSite: "Strict"
      });
    }

    navigate("/home");
  };

  const handleSearch = (query) => setSearchQuery(query);

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/home" /> : <Login onLogin={handleLoginOrSignup} onSwitch={() => navigate("/signup")} />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/home" /> : <Signup onSignup={handleLoginOrSignup} onSwitch={() => navigate("/")} />}
      />
      <Route
        path="/home"
        element={
          user ? (
            <MiniMart
              user={user}
              cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
              onNavigate={(page) => navigate(`/${page}`)}
              onLogout={handleLogout}
              searchQuery={searchQuery}
              onSearch={handleSearch}
            >
              <ProductList
                user={user}
                onAddToCart={handleAddToCart}
                searchQuery={searchQuery}
              />
            </MiniMart>
          ) : (
            <Login onLogin={handleLoginOrSignup} onSwitch={() => navigate("/signup")} />
          )
        }
      />
      <Route
        path="/cart"
        element={
          user ? (
            <MiniMart
              user={user}
              cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
              onNavigate={(page) => navigate(`/${page}`)}
              onLogout={handleLogout}
              searchQuery={searchQuery}
              onSearch={handleSearch}
            >
              <Cart
                user={user}
                cartItems={cart}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
                onClearCart={handleClearCart}
              />
            </MiniMart>
          ) : (
            <Login onLogin={handleLoginOrSignup} onSwitch={() => navigate("/signup")} />
          )
        }
      />
      <Route
        path="/orders"
        element={
          user ? <MyOrders user={user} /> : <Login onLogin={handleLoginOrSignup} onSwitch={() => navigate("/signup")} />
        }
      />
      <Route
        path="/product/:id"
        element={
          <MiniMart
            user={user}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            onNavigate={(page) => navigate(`/${page}`)}
            onLogout={handleLogout}
            searchQuery={searchQuery}
            onSearch={handleSearch}
          >
            <ProductDetail />
          </MiniMart>
        }
      />
    </Routes>
  );
};

// ========== Main App ==========
function App() {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load user from cookies on page load
  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) setUser(JSON.parse(cookieUser));
    setUserLoaded(true);
  }, []);

  if (!userLoaded) return <div>Loading...</div>;

  return (
    <Router>
      <AppRoutes
        user={user}
        setUser={setUser}
        cart={cart}
        setCart={setCart}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
    />
    </Router>
  );
}

export default App;