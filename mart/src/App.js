import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import MiniMart from "./components/MiniMart";
import MyOrders from "./components/MyOrders";
import ProductDetail from "./components/ProductDetail";

import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import axios from "axios";

// ========== AppRoutes ==========
const AppRoutes = ({
  user,
  setUser,
  cart,
  setCart,
  searchQuery,
  setSearchQuery,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.email) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/cart/${encodeURIComponent(user.email)}`
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
  }, [user]);


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

    const userEmail = user?.email;
    if (!userEmail) return;

    /*try {
      await axios.post("http://localhost:5000/cart", {
        userEmail,
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: existingItem ? existingItem.quantity + 1 : 1,
        image: product.image,
      });
      //toast.success("Item added to cart!");
    } catch (err) {
      console.error("Add to cart error", err);
    }*/
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);

    const item = cart.find((item) => item.productId === productId);
    const userEmail = user?.email;
    if (!userEmail || !item) return;

  };

  const handleRemoveFromCart = async (productId) => {
    const userEmail = user?.email;
    if (!userEmail) return;

    try {
      const updated = cart.filter((item) => item.productId !== productId);
      setCart(updated);
    } catch (err) {
      console.error("Delete cart item error", err);
    }
  };

  const handleClearCart = () => setCart([]);



  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleLogout = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        await axios.post("http://localhost:5000/logout", { token });
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

  const handleLoginOrSignup = (u) => {
    setUser(u);
    Cookies.set("user", JSON.stringify(u), {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });

    if (u.token) {
      Cookies.set("token", u.token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
    }

    navigate("/home");
    
  };
  

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Login
            onLogin={handleLoginOrSignup}
            onSwitch={() => navigate("/signup")}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <Signup
            //onSignup={handleLoginOrSignup}
            onSwitch={() => navigate("/")}
          />
        }
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
            <Login
              onLogin={handleLoginOrSignup}
              onSwitch={() => navigate("/signup")}
            />
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
            <Login
              //onLogin={handleLoginOrSignup}
              onSwitch={() => navigate("/signup")}
            />
          )
        }
      />
      <Route path="/orders" element={<MyOrders />} />
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

// ✅ Define and export the App component
function App() {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) {
      setUser(JSON.parse(cookieUser));
    }
    setUserLoaded(true); // ✅ this always runs, so Login page will show
  }, []);

  if (!userLoaded) return null;

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
      <ToastContainer position="top-center" autoClose={2000} />
    </Router>
  );
}

export default App;
