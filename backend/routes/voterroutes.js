const express = require("express");
const router = express.Router();
const Voter = require("../models/Voter");

// register a voter (creates a voter record and returns id) - minimal
router.post("/register", async (req, res) => {
  try {
    const voter = new Voter({});
    await voter.save();
    res.status(201).json({ voterId: voter._id, hasVoted: voter.hasVoted });
  } catch (err) {
    res.status(500).json({ error: "failed to register voter" });
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