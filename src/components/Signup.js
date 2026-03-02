import "./Signup.css";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Signup = ({ onSwitch, onSignup }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.post("https://buyhive-7.onrender.com/signup", formData);

      if (response.status === 201 && response.data.success) {
        const newUser = response.data.user;

        // Save user info in cookies (without token)
        Cookies.set(
          "user",
          JSON.stringify({ name: newUser.name, email: newUser.email }),
          { expires: 30, secure: true, sameSite: "Strict" }
        );

        // Save token in cookies
        Cookies.set("token", newUser.token, { expires: 30, secure: true, sameSite: "Strict" });

        // Update parent App state so username shows immediately
        onSignup(newUser);
      } else {
        alert(response.data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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

        <button type="submit">Sign Up</button>

        <p className="switch-text">
          Already have an account? <span onClick={onSwitch}>Log in</span>
        </p>
      </form>
    </div>
  );
};

export default Signup;