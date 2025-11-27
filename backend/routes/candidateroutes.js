const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");

// Add Candidate
router.post("/add", async (req, res) => {
  try {
    const { fullName, party } = req.body;

    if (!fullName || !party) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCandidate = new Candidate({ fullName, party });
    await newCandidate.save();

    res.status(201).json({
      message: "Candidate added successfully",
      candidate: newCandidate,
    });
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

// Vote for candidate
router.post("/vote/:id", async (req, res) => {
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: 1 } },
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json({ message: "Vote added", candidate: updatedCandidate });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
