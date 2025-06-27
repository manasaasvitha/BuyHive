
import React, { useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import './ProductList.css';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 



function ProductList({ onAddToCart , searchQuery,user }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        setProducts(res.data.products);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    //const user = JSON.parse(Cookies.get("user"));
    const userEmail = user?.email;
    const productId = product._id;  // 🔥 Use _id from DB

    try {
      await axios.post("http://localhost:5000/cart", {
        userEmail,
        productId,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
      toast.success("Item added to cart!");
      onAddToCart(product);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );


  return (
    <div className="shop">
      <h2>Products</h2>
      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                alt={product.name}
                className="product-image"
                onClick={() => navigate(`/product/${product._id}`)}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
              <h4>{product.name}</h4>
              <p>₹{product.price.toLocaleString()}</p>
              <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>

          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;