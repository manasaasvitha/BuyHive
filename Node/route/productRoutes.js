const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../model/Product"); // Adjust path as needed

// multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ✅ POST /products (with image)
// in routes/productRoutes.js
router.post("/products", upload.single("image"), async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  console.log("🛎️ Received POST /products, body:", req.body, ", file:", req.file);
  try {
    const { name, price } = req.body;
    const image = req.file ? req.file.filename : null;
    const newProduct = new Product({ name, price, image });
    await newProduct.save();
    console.log("✅ Product saved:", newProduct);
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("🔴 POST /products error:", error);
    res.status(500).json({ success: false, message: "Error saving product" });
  }
});


// ✅ GET /products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
