const express = require("express");
const router = express.Router();
const Order = require("../model/Order");
const Cart = require("../model/CartItem");
const sendEmail = require("../utils/mailer");

// ✅ Existing route: Place order from Cart (used in `/place-order`)
router.post("/place-order", async (req, res) => {
  const { userEmail } = req.body;

  try {
    const items = await Cart.find({ userEmail });

    if (!items.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
      userEmail,
      products: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      createdAt: new Date(),
    });

    await newOrder.save();
    await Cart.deleteMany({ userEmail });

    const orderDetailsHtml = items.map(
      (item) =>
        `<li>${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}</li>`
    ).join("");

    const htmlContent = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #4CAF50;">🧾 Order Confirmation - BuyHive</h2>
    <p><strong>User Email:</strong> ${userEmail}</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background-color: #f8f8f8; color: #333;">
          <th style="border: 1px solid #ddd; padding: 10px;">Product</th>
          <th style="border: 1px solid #ddd; padding: 10px;">Quantity</th>
          <th style="border: 1px solid #ddd; padding: 10px;">Unit Price</th>
          <th style="border: 1px solid #ddd; padding: 10px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${items
        .map(
          (item, index) => `
          <tr style="background-color: ${index % 2 === 0 ? "#ffffff" : "#f2f2f2"};">
            <td style="border: 1px solid #ddd; padding: 10px;">${item.name}</td>
            <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${item.quantity}</td>
            <td style="border: 1px solid #ddd; padding: 10px;">₹${item.price}</td>
            <td style="border: 1px solid #ddd; padding: 10px;">₹${item.price * item.quantity}</td>
          </tr>
        `
        )
        .join("")}
        <tr style="background-color: #e8f5e9; font-weight: bold;">
          <td colspan="3" style="border: 1px solid #ddd; padding: 10px; text-align: right;">Grand Total:</td>
          <td style="border: 1px solid #ddd; padding: 10px;">₹${totalAmount}</td>
        </tr>
      </tbody>
    </table>
    <p style="margin-top: 20px; color: #333;">Thank you for shopping with <strong>BuyHive</strong>! 😊</p>
  </div>
`;


    try {
      sendEmail(userEmail, "🧾 Your Order Confirmation - Buy Hive", htmlContent);
    } catch (err) {
      console.error("❌ Failed to send user email:", err.message);
    }

    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.GOOGLE_MAIL;
      sendEmail(adminEmail, `📥 New Order from ${userEmail}`, htmlContent);
    } catch (err) {
      console.error("❌ Failed to send admin email:", err.message);
    }

    res.status(200).json({ success: true, message: "Order placed and emails sent" });
  } catch (err) {
    console.error("❌ Order placement failed:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ New route: POST /orders — for frontend compatibility
router.post("/orders", async (req, res) => {
  const { userEmail, products, totalAmount } = req.body;

  if (!userEmail || !products || !products.length) {
    return res.status(400).json({ error: "Missing order details" });
  }

  try {
    const order = new Order({
      userEmail,
      products,
      totalAmount,
      createdAt: new Date(),
    });

    await order.save();
    await Cart.deleteMany({ userEmail }); // clear cart after order

    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    console.error("❌ Order saving failed", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// ✅ Get My Orders
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
