const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const Voter = require("../models/Voter"); // added

// Add Candidate
router.post("/add", async (req, res) => {
  try {
    const { fullName, party } = req.body;
    if (!fullName || !party) return res.status(400).json({ message: "All fields are required" });

    const newCandidate = new Candidate({ fullName, party });
    await newCandidate.save();

    res.status(201).json({ message: "Candidate added successfully", candidate: newCandidate });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all candidates
router.get("/list", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// for deleting a candidate if admin wants to remove one
router.delete("/delete/:id", async (req, res) => {
  try {
    const candidateId = req.params.id;
    const deleted = await Candidate.findByIdAndDelete(candidateId);
    
    if (!deleted) return res.status(404).json({ message: "Candidate not found" });
    
    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// Vote for candidate - requires voterId in body; prevents double-vote
router.post("/vote/:id", async (req, res) => {
  try {
    const candidateId = req.params.id;
    const { voterId } = req.body;
    if (!voterId) return res.status(400).json({ message: "voterId is required" });

    // load voter
    const voter = await Voter.findById(voterId);
    if (!voter) return res.status(404).json({ message: "Voter not found" });
    if (voter.hasVoted) return res.status(400).json({ message: "Voter has already voted" });

    // increment candidate votes atomically
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { votes: 1 } },
      { new: true }
    );

    if (!updatedCandidate) return res.status(404).json({ message: "Candidate not found" });

    // mark voter as voted
    voter.hasVoted = true;
    voter.votedFor = updatedCandidate._id;
    voter.votedAt = new Date();
    await voter.save();

    return res.json({ message: "Vote recorded", candidate: updatedCandidate, voterId: voter._id });
  } catch (err) {
    console.error("vote error:", err);
    return res.status(500).json({ message: "server error" });
  }
});

module.exports = router;