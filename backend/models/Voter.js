const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  name: String,
  pin: String,
  phone: String,
  otp: String,
  hasVoted: {
    type: Boolean,
    default: false
  }
});

// Ensure Mongoose uses the EXACT collection: `voterlist`
// (was `voterslist` which may not match the actual DB collection)
module.exports = mongoose.model("Voter", voterSchema, "voterslist");
