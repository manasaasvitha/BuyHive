const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_MAIL,
    pass: process.env.GOOGLE_PASS,
  },
});

/**
 * Send email via Gmail SMTP
 */
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"BuyHive🛍" <${process.env.GOOGLE_MAIL}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
};

module.exports = sendEmail;
