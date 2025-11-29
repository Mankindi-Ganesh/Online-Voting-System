// ...existing code...
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

function normalizePhone(p = "") {
  const digits = p.replace(/\D/g, "");
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

/**
 * POST /api/send-otp
 * body: { phone, pin? }
 * returns { success, message, otp? } (otp only in non-production for dev)
 */
// router.post("/send-otp", async (req, res) => {
//   try {
//     const { phone } = req.body;
//     if (!phone) return res.status(400).json({ success: false, message: "phone required" });

//     const otp = generateOtp(6);
//     const hashed = hashOtp(phone, otp);
//     const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

//     // store hashed value + raw otp (raw otp only for dev/testing store)
//     otpStore.set(phone, { hashed, otp, expiresAt });

//     // send SMS here in production (Twilio, etc). For dev we log and return otp
//     console.log(`OTP for ${phone}: ${otp}`);

//     const payload = { success: true, message: "OTP sent" };
//     if (process.env.NODE_ENV !== "production") payload.otp = otp; // dev-only

//     return res.json(payload);
//   } catch (err) {
//     console.error("send-otp error:", err);
//     return res.status(500).json({ success: false, message: "server error" });
//   }
// });

router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: "phone required" });
    }

    const normalizedPhone = normalizePhone(phone);

    // Find voter by phone (10-digit only)
    const voter = await Voter.findOne({ phone: normalizedPhone });
    if (!voter) {
      return res.status(404).json({ success: false, message: "Voter not found" });
    }

    if (voter.hasVoted) {
      return res.status(400).json({
        success: false,
        alreadyVoted: true,
        message: "You have already voted. OTP cannot be sent.",
      });
    }

    const otp = generateOtp(6);
    const hashed = hashOtp(normalizedPhone, otp);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(normalizedPhone, { hashed, otp, expiresAt });

    console.log(`OTP for ${normalizedPhone}: ${otp}`);

    const payload = { success: true, message: "OTP sent" };
    if (process.env.NODE_ENV !== "production") payload.otp = otp;

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
// router.post("/verify-otp", async (req, res) => {
//   try {
//     const { phone, otp } = req.body;
//     if (!phone || !otp) return res.status(400).json({ success: false, message: "phone and otp required" });

//     const record = otpStore.get(phone);
//     if (!record) return res.status(400).json({ success: false, message: "otp not found or expired" });
//     if (Date.now() > record.expiresAt) {
//       otpStore.delete(phone);
//       return res.status(400).json({ success: false, message: "otp expired" });
//     }

//     // compare HMACs safely (both hex)
//     const hashedAttempt = hashOtp(phone, otp);
//     try {
//       const a = Buffer.from(hashedAttempt, "hex");
//       const b = Buffer.from(record.hashed, "hex");
//       if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
//         return res.status(400).json({ success: false, message: "invalid otp" });
//       }
//     } catch (cmpErr) {
//       return res.status(400).json({ success: false, message: "invalid otp" });
//     }
//      // atomic find-or-create (upsert) to avoid duplicate-key races
//     const voter = await Voter.findOneAndUpdate(
//       { phone },
//       { $setOnInsert: { phone, hasVoted: false } },
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     // clear OTP after successful verification
//     otpStore.delete(phone);

//     return res.json({
//       success: true,
//       voterId: voter._id,
//       hasVoted: Boolean(voter.hasVoted),
//       message: "OTP verified",
//     });
//   } catch (err) {
//     console.error("verify-otp unexpected error:", err);
//     return res.status(500).json({ success: false, message: "server error" });
//   }
// });
// helper function (same one used in send-otp)
function normalizePhone(p = "") {
  const digits = p.replace(/\D/g, "");
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "phone and otp required"
      });
    }

    const normalizedPhone = normalizePhone(phone);  // 🔥 CRITICAL

    // --- OTP STORE LOOKUP ---
    const record = otpStore.get(normalizedPhone);   // 🔥 use normalized
    if (!record) {
      return res.status(400).json({
        success: false,
        message: "otp not found or expired"
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedPhone);
      return res.status(400).json({
        success: false,
        message: "otp expired"
      });
    }

    // --- OTP COMPARISON ---
    const hashedAttempt = hashOtp(normalizedPhone, otp);  // 🔥 use normalized
    try {
      const a = Buffer.from(hashedAttempt, "hex");
      const b = Buffer.from(record.hashed, "hex");

      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return res.status(400).json({ success: false, message: "invalid otp" });
      }
    } catch (cmpErr) {
      return res.status(400).json({ success: false, message: "invalid otp" });
    }

    // --- GET EXISTING VOTER ---
    const voter = await Voter.findOne({ phone: normalizedPhone }); // 🔥 ONLY find
    if (!voter) {
      return res.status(404).json({
        success: false,
        message: "voter not found"
      });
    }

    // delete OTP (cleanup)
    otpStore.delete(normalizedPhone);

    return res.json({
      success: true,
      voterId: voter._id,
      hasVoted: Boolean(voter.hasVoted),
      message: "OTP verified"
    });

  } catch (err) {
    console.error("verify-otp unexpected error:", err);
    return res.status(500).json({
      success: false,
      message: "server error"
    });
  }
});


// Voter status route used by frontend to check hasVoted
router.get("/voters/status/:id", async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id).lean();
    if (!voter) return res.status(404).json({ success: false, message: "voter not found" });
    return res.json({ success: true, voterId: voter._id, hasVoted: Boolean(voter.hasVoted), votedFor: voter.votedFor || null });
  } catch (err) {
    console.error("voter status error:", err);
    return res.status(500).json({ success: false, message: "server error" });
  }
});


module.exports = router;