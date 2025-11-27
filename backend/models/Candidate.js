const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  party: {
    type: String,
    required: true,
    trim: true,
  },
  votes: {
    type: Number,
    default: 0,
  }
});

// Use the EXACT collection name: candidatelist
module.exports = mongoose.model("Candidate", candidateSchema, "candidateslist");
