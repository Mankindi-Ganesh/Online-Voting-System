const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const Voter = require("../models/Voter");

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

// Delete a candidate
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

    // FIND existing voter by voterId (do NOT create new voter)
    const voter = await Voter.findById(voterId);
    if (!voter) return res.status(404).json({ message: "Voter not found" });
    if (voter.hasVoted) return res.status(400).json({ message: "Voter has already voted" });

    // increment candidate votes
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { votes: 1 } },
      { new: true }
    );

    if (!updatedCandidate) return res.status(404).json({ message: "Candidate not found" });

    // UPDATE the existing voter record (do NOT create new one)
    voter.hasVoted = true;
    voter.votedFor = updatedCandidate._id;
    voter.votedAt = new Date();
    await voter.save(); // saves the updated voter record

    console.log(`Vote recorded: voter ${voterId} voted for candidate ${candidateId}`);

    res.json({
      message: "Vote recorded",
      voterId: voter._id,
      hasVoted: voter.hasVoted,
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error("vote error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;