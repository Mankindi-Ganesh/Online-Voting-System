const express = require("express");
const router = express.Router();
const Voter = require("../models/Voter");
const crypto = require("crypto");

const otpStore = new Map();
const HMAC_SECRET = process.env.OTP_HMAC_SECRET || "change_me";

function normalizePhone(p = "") {
  const digits = p.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOtp(phone, otp) {
  return crypto
    .createHmac("sha256", HMAC_SECRET)
    .update(`${phone}:${otp}`)
    .digest("hex");
}

/* ================= SEND OTP ================= */
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: "phone required" });
    }

    const normalizedPhone = normalizePhone(phone);

    const voter = await Voter.findOne({ phone: normalizedPhone });
    if (!voter) {
      return res.status(404).json({ success: false, message: "Voter not found" });
    }

    if (voter.hasVoted) {
      return res.status(400).json({
        success: false,
        alreadyVoted: true,
        message: "You already voted",
      });
    }

    const otp = generateOtp();
    const hashed = hashOtp(normalizedPhone, otp);

    otpStore.set(normalizedPhone, {
      hashed,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    console.log(`OTP for ${normalizedPhone}: ${otp}`);

    res.json({ success: true, message: "OTP sent", otp });
  } catch (err) {
    console.error("send-otp error:", err);
    res.status(500).json({ success: false, message: "server error" });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const normalizedPhone = normalizePhone(phone);

    const record = otpStore.get(normalizedPhone);
    if (!record || Date.now() > record.expiresAt) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const hashedAttempt = hashOtp(normalizedPhone, otp);
    if (hashedAttempt !== record.hashed) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    otpStore.delete(normalizedPhone);

    const voter = await Voter.findOne({ phone: normalizedPhone });
    res.json({
      success: true,
      voterId: voter._id,
      hasVoted: voter.hasVoted,
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    res.status(500).json({ success: false, message: "server error" });
  }
});

module.exports = router;
