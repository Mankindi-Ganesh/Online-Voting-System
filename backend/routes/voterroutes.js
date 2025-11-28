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
router.get("/status/:id", async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id);
    if (!voter) return res.status(404).json({ error: "voter not found" });
    res.json({ voterId: voter._id, hasVoted: voter.hasVoted, votedFor: voter.votedFor });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;