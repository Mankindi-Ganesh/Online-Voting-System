const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const voterRoutes = require("./routes/authRoutes.js");
const adminRoute = require("./routes/adminRoutes.js");
const candidateRoutes = require("./routes/candidateroutes.js");
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", voterRoutes);
app.use("/api", adminRoute);
app.use("/api/candidates", candidateRoutes);

app.get("/", (req, res) => {
  res.send("Backend running successfully ✔");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
