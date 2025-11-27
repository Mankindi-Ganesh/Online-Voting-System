const express = require("express");
const router = express.Router();
const Voter = require("../models/Voter");

// =============================
// SEND OTP & CHECK VOTER
// =============================
router.post("/send-otp", async (req, res) => {
  let pin = String(req.body.pin).trim();
  let phone = String(req.body.phone).trim();

  console.log("🔍 Incoming Request (PIN + Phone):", { pin, phone });

  try {
    // Check voter in DB
    const voter = await Voter.findOne({ pin, phone });

    console.log("📌 Voter Found in DB:", voter);

    if (!voter) {
      console.log("❌ No voter found → Not eligible");
      return res.status(400).json({ message: "Not eligible to vote" });
    }

    if (voter.hasVoted) {
      console.log("⚠️ Voter already voted");
      return res.status(400).json({ message: "You have already voted" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    voter.otp = otp;
    await voter.save();

    console.log(`📨 OTP Generated for ${phone}: ${otp}`);

    res.json({ message: "OTP sent successfully", otp });
  } catch (err) {
    console.error("❌ Server Error in /send-otp:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// =============================
// VERIFY OTP
// =============================
router.post("/verify-otp", async (req, res) => {
  let otp = String(req.body.otp).trim();

  console.log("🔍 Incoming OTP:", otp);

  try {
    const voter = await Voter.findOne({ otp });

    console.log("📌 OTP Matched Voter:", voter);

    if (!voter) {
      console.log("❌ Invalid OTP entered");
      return res.status(400).json({ message: "Invalid OTP" });
    }

    voter.hasVoted = true;
    voter.otp = null;
    await voter.save();

    console.log("✅ Voter marked as voted");

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error("❌ Server Error in /verify-otp:", err.message);
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
