const express = require("express");
const app = express();
app.use(express.json());

// Example admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

// Admin login route
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ message: "Login successful" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
