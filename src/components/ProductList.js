import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductList.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductList({ onAddToCart, searchQuery, user }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://buyhive-7.onrender.com/products");
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by searchQuery
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async (product) => {
    if (!user?.email) {
      toast.warning("Please login to add items to cart!");
      return;
    }

    try {
      await axios.post("https://buyhive-7.onrender.com/cart", {
        userEmail: user.email,
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });

      onAddToCart(product);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add product to cart.");
    }
  };

  return (
    <div className="shop">

      {/* ---------- SAMSUNG ---------- */}
      <h2>Samsung</h2>
      <div className="product-grid">
        {filteredProducts
          .filter(product => product.brand === "Samsung")
          .map(product => (
            <div key={product._id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                onClick={() => navigate(`/product/${product._id}`)}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
              <h4>{product.name}</h4>
              <p>₹{product.price.toLocaleString()}</p>
              <button onClick={() => handleAdd(product)}>Add to Cart</button>
            </div>
          ))}
      </div>


      <br />
      <h2>Apple</h2>
      <div className="product-grid">
        {filteredProducts
          .filter(product => product.brand === "Apple")
          .map(product => (
            <div key={product._id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                onClick={() => navigate(`/product/${product._id}`)}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
              <h4>{product.name}</h4>
              <p>₹{product.price.toLocaleString()}</p>
              <button onClick={() => handleAdd(product)}>Add to Cart</button>
            </div>
          ))}
      </div>

      <br />
      <h2>Xiaomi</h2>
      <div className="product-grid">
        {filteredProducts
          .filter(product => product.brand === "Xiaomi")
          .map(product => (
            <div key={product._id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                onClick={() => navigate(`/product/${product._id}`)}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
              <h4>{product.name}</h4>
              <p>₹{product.price.toLocaleString()}</p>
              <button onClick={() => handleAdd(product)}>Add to Cart</button>
            </div>
          ))}
      </div>

      <br />
      <h2>HP</h2>
      <div className="product-grid">
        {filteredProducts
          .filter(product => product.brand === "HP")
          .map(product => (
            <div key={product._id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                onClick={() => navigate(`/product/${product._id}`)}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
              <h4>{product.name}</h4>
              <p>₹{product.price.toLocaleString()}</p>
              <button onClick={() => handleAdd(product)}>Add to Cart</button>
            </div>
          ))}
      </div>

    </div>
  );
}

export default ProductList;