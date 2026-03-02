import React from "react";
import "./MiniMart.css";


const MiniMart = ({
  user,
  cartCount,
  onNavigate,
  onLogout,
  children,
  onSearch,
  searchQuery,
}) => {
  return (
    <div className="minimart-wrapper">
      <header className="minimart-header">
        {/* Logo */}
        <div className="logo" onClick={() => onNavigate("shop")}>
          🛍️BuyHive
        </div>

        {/* Search bar */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Username display */}
        {user && (
          <div className="user-info">
            <span className="user-name">👤 {user.name}</span>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="nav-buttons">
          <button onClick={() => onNavigate("home")}>Shop</button>
          <button onClick={() => onNavigate("cart")}>Cart ({cartCount})</button>
          <button onClick={() => onNavigate("orders")}>📦 My Orders</button>

          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      {/* Main content */}
      <main className="minimart-main">{children}</main>
      
    </div>
  );
};

export default MiniMart;
