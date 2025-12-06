const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const candidateRoutes = require("./routes/candidateroutes");
const voterRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const path = require("path");

const app = express();

// -----------------------------
// MIDDLEWARES
// -----------------------------
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------
// ROUTES
// -----------------------------
app.use("/api/candidates", candidateRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api", adminRoutes);

// -----------------------------
// MONGO DB CONNECTION
// -----------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// -----------------------------
// SERVER START
// -----------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});