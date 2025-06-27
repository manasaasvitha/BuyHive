require('dotenv').config(); // optional if you're running locally with .env
const mongoose = require('mongoose');

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); 
const authRoutes = require("./route/auth");
const cartRoutes = require("./route/cartRoutes");
const ProductRoutes = require("./route/productRoutes");
const orderRoutes = require("./route/orderRoutes");


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


// Connect to MongoDB
connectDB();

// Product routes
//app.use("/api/products", productcontroller);

app.use("/products", ProductRoutes); // ✅ Register the route


// Auth routes
app.use("/", authRoutes);
// app.post("/login", userController.login);

//cart

app.use("/", cartRoutes);

app.use("/orders", orderRoutes);


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

// Start server
app.listen(PORT, () => { //PORT
  console.log(`Server running on http://localhost:${PORT}`);
});



