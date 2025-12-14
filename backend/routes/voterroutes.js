const express = require("express");
const router = express.Router();
const Voter = require("../models/Voter");

// register a voter (creates a voter record and returns id) - now requires phone
router.post("/register", async (req, res) => {
  try {
    const { phone, pin } = req.body;
    if (!phone) return res.status(400).json({ error: "phone required" });

      const normalizedPhone = normalizePhone(phone); // 🔥 only 10 digits

    if (normalizedPhone.length !== 10) {
      return res.status(400).json({ error: "Phone must be 10 digits" });
    }


    // atomic find-or-create so duplicates cannot cause errors
    const voter = await Voter.findOneAndUpdate(
      { phone: normalizedPhone },
      { $setOnInsert: { phone: normalizedPhone, pin: pin || undefined, hasVoted: false } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ voterId: voter._id, hasVoted: voter.hasVoted });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ error: "failed to register voter" });
  }
});
// ================= VOTER STATUS =================
// GET /api/status/:id
router.get("/status/:id", async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id).lean();

    if (!voter) {
      return res.status(404).json({
        success: false,
        message: "Voter not found",
      });
    }

    return res.json({
      success: true,
      voterId: voter._id,
      hasVoted: Boolean(voter.hasVoted),
      votedFor: voter.votedFor || null,
    });
  } catch (err) {
    console.error("Voter status error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
// get voter status
// Add this to authRoutes.js (or create voterRoutes.js)

/**
 * GET /api/voters/status/:id
 * Returns voter status including hasVoted flag
 */
// router.get("/status/:id", async (req, res) => {
//   try {
//     const voterId = req.params.id;
    
//     const voter = await Voter.findById(voterId);
//     if (!voter) {
//       return res.status(404).json({ success: false, message: "Voter not found" });
//     }

//     res.json({
//       success: true,
//       voterId: voter._id,
//       hasVoted: Boolean(voter.hasVoted),
//       votedFor: voter.votedFor || null,
//     });
//   } catch (err) {
//     console.error("Voter status error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

module.exports = router;