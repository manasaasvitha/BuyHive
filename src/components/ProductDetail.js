import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://buyhive-7.onrender.com/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading product details...</p>;

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <img
        src={product.image}
        alt={product.name}
        className="product-detail-image"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/400x300?text=No+Image";
        }}
      />
      <p><strong>Price:</strong> ₹{product.price.toLocaleString()}</p>
      <p><strong>Description:</strong> {product.description}</p>

      <button onClick={() => navigate("/home")} className="back-button">🔙 Back to Shop</button>
    </div>
  );
};

export default ProductDetail;
