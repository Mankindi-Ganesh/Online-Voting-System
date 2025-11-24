const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

app.post("/send-otp", (req, res) => {
  console.log(req.body.phone);
  res.json({ message: "OTP sent!" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
