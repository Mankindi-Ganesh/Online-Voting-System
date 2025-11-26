const express = require("express");
const router = express.Router();

router.post("/admin-login", (req, res) => {
  const { username, password } = req.body;

  // Validate from .env
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

module.exports = router;
