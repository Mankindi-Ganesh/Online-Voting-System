const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const { verifyAdmin } = require("../middleware/authMiddleware");

router.post("/add", verifyAdmin, candidateController.addCandidate);
router.patch("/shortlist/:id", verifyAdmin, candidateController.shortlistCandidate);
router.get("/", verifyAdmin, candidateController.getCandidates);

module.exports = router;
