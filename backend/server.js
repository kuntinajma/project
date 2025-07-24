const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const { testConnection } = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3005;

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false, // 👈 Matikan ini
    // atau atur:
    // crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3005",
      process.env.FRONTEND_URL || "http://localhost:3000",
    ],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Terlalu banyak request, coba lagi nanti.",
  },
});

app.use("/api/", limiter);

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("combined"));
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use(
  "/uploads",
  (req, res, next) => {
    res.removeHeader("Cross-Origin-Resource-Policy");
    res.header("Access-Control-Allow-Origin", "*"); // 👈 Allow any origin
    res.header("Access-Control-Allow-Methods", "GET, HEAD");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Test database connection
testConnection();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/destinations", require("./routes/destinations"));
app.use("/api/packages", require("./routes/packages"));
app.use("/api/msme", require("./routes/msme"));
app.use("/api/products", require("./routes/products"));
app.use("/api/culture", require("./routes/culture"));
app.use("/api/articles", require("./routes/articles"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/dashboard", require("./routes/dashboard"));

app.use("/api/google-reviews", require("./routes/googleReviews"));
app.use("/api/testimonials", require("./routes/testimonials"));
app.use("/api/files", require("./routes/files"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Pulau Laiya API is running with MySQL",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Pulau Laiya API Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`🗄️ Database: MySQL`);
});

module.exports = app;
