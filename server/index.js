const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());

// =========================
// Routes
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

// =========================
// Test Route
// =========================
app.get("/", (req, res) => {
  res.send("TripVault Backend is Running 🚀");
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});