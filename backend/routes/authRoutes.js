const express = require("express");
const router = express.Router();
const Voter = require("../models/Voter");
const crypto = require("crypto");

const HMAC_SECRET = process.env.OTP_HMAC_SECRET || "change_me";
const otpStore = new Map();

function generateOtp(length = 6) {
  return String(Math.floor(Math.random() * Math.pow(10, length))).padStart(length, "0");
}
function hashOtp(phone, otp) {
  return crypto.createHmac("sha256", HMAC_SECRET).update(`${phone}:${otp}`).digest("hex");
}

/**
 * POST /api/send-otp
 * body: { phone, pin? }
 * returns { success, message, otp? } (otp only in non-production for dev)
 */
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "phone required" });

    const otp = generateOtp(6);
    const hashed = hashOtp(phone, otp);
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // store hashed value + raw otp (raw otp only for dev/testing store)
    otpStore.set(phone, { hashed, otp, expiresAt });

    // send SMS here in production (Twilio, etc). For dev we log and return otp
    console.log(`OTP for ${phone}: ${otp}`);

    const payload = { success: true, message: "OTP sent" };
    if (process.env.NODE_ENV !== "production") payload.otp = otp; // dev-only

    return res.json(payload);
  } catch (err) {
    console.error("send-otp error:", err);
    return res.status(500).json({ success: false, message: "server error" });
  }
});

/**
 * POST /api/verify-otp
 * body: { phone, otp }
 * returns { success, voterId, hasVoted }
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ success: false, message: "phone and otp required" });

    const record = otpStore.get(phone);
    if (!record) return res.status(400).json({ success: false, message: "otp not found or expired" });

    if (Date.now() > record.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({ success: false, message: "otp expired" });
    }

    const hashedAttempt = hashOtp(phone, otp);
    if (!crypto.timingSafeEqual(Buffer.from(hashedAttempt), Buffer.from(record.hashed))) {
      return res.status(400).json({ success: false, message: "invalid otp" });
    }

    // OTP valid -> find or create voter (do NOT set hasVoted here)
    let voter = await Voter.findOne({ phone });
    if (!voter) {
      voter = new Voter({ phone }); // hasVoted defaults to false in model
      await voter.save();
    }

    // remove OTP after successful verification
    otpStore.delete(phone);

    return res.json({
      success: true,
      voterId: voter._id,
      hasVoted: Boolean(voter.hasVoted),
      message: "OTP verified",
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    return res.status(500).json({ success: false, message: "server error" });
  }
});

module.exports = router;