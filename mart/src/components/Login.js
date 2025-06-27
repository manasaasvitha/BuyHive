/*
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = ({ onLogin, onSwitch }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.warn("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", formData);

      if (response.status === 200 && response.data.success) {
        const { user } = response.data;

        if (!user || !user.token) {
          toast.error("Token not received from backend.");
          return;
        }

        toast.success("Login successful!");

        // ✅ Save user object in cookie (excluding token from inside object)
        const userData = {
          name: user.name,
          email: user.email,
        };
        Cookies.set("user", JSON.stringify(userData), {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });

        // ✅ Save token separately
        Cookies.set("token", user.token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });

        onLogin(user); // Pass full user object including token if needed

        setTimeout(() => navigate("/home"), 2500);
      } else {
        toast.error(response.data.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Welcome Back!</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <p className="switch-text">
          Don&apos;t have an account? <span onClick={onSwitch}>Sign up</span>
        </p>
      </form>

      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default Login;
*/

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = ({  onLogin , onSwitch }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.warn("Please fill in all fields.");
      return;
    }

    try {
      // Optional loading toast
      //toast.info("Logging in...");

      const response = await axios.post("http://localhost:5000/login", formData);

      if (response.status === 200 && response.data.success) {
        const { user } = response.data;

        if (!user || !user.token) {
          toast.error("Token not received from backend.");
          return;
        }

        toast.success("Login successful!");

        // Save user data without token in `user` cookie
        const userData = { name: user.name, email: user.email };
        Cookies.set("user", JSON.stringify(userData), {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });

        // Save token separately
        Cookies.set("token", user.token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });

        onLogin(user); // full user object (if needed elsewhere)

        // Navigate after short delay
        //setTimeout(() => navigate("/home"), 1000);
        navigate("/home");
      } else {
        toast.error(response.data.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Welcome Back!</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <p className="switch-text">
          Don&apos;t have an account? <span onClick={onSwitch}>Sign up</span>
        </p>
      </form>

      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
};

export default Login;
