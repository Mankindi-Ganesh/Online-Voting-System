const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  image: { type: String },
  shortlisted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Candidate", candidateSchema);
