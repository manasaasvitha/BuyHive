import "./Signup.css";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = ({ onSwitch }) => {
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

    if (formData.name && formData.email && formData.password) {
      try {
        const response = await axios.post("http://localhost:5000/signup", formData);

        if (response.status === 201) {
          toast.success("Signup successful!");
          setTimeout(() => onSwitch(), 2000);
        } else {
          toast.error("Signup failed. Please try again.");
        }
      } catch (err) {
        console.error("Signup error:", err);
        toast.error("Signup failed. Email may already be in use.");
      }
    } else {
      toast.warn("Please fill all fields.");
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
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Signup;
