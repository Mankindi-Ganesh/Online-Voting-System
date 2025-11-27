const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidateModel");

// ----------------------------
// ADD NEW CANDIDATE
// ----------------------------
router.post("/add", async (req, res) => {
  try {
    const { fullName, party } = req.body;

    if (!fullName || !party) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCandidate = new Candidate({ fullName, party });
    await newCandidate.save();

    res.status(201).json({ message: "Candidate added successfully", candidate: newCandidate });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ----------------------------
// GET ALL CANDIDATES
// ----------------------------
router.get("/list", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ----------------------------
// VOTE FOR A CANDIDATE
// ----------------------------
router.post("/vote/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      { $inc: { votes: 1 } }, // increase vote by 1
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({
      message: "Vote added successfully",
      candidate: updatedCandidate
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
