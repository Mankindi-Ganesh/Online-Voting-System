const Candidate = require("../models/candidate");

exports.addCandidate = async (req, res) => {
  try {
    const { name, party, image } = req.body;
    const candidate = new Candidate({ name, party, image });
    await candidate.save();
    res.json({ message: "Candidate added successfully", candidate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.shortlistCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { shortlisted: true },
      { new: true }
    );
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });
    res.json({ message: "Candidate shortlisted", candidate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
