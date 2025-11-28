const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  name: String,
  pin: { type: String, unique: true }, // unique PIN
  phone: { type: String, unique: true ,sparse: true}, // unique phone number String,
  otp: String,
  // you can expand with phone/email/name later
    createdAt: { type: Date, default: Date.now },
    hasVoted: { type: Boolean, default: false },
    votedFor: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", default: null },
    votedAt: { type: Date, default: null }
},
  { timestamps: true },
);

// Ensure Mongoose uses the EXACT collection: `voterlist`
// (was `voterslist` which may not match the actual DB collection)
module.exports = mongoose.model("Voter", voterSchema, "voterslist");
