const express = require("express");
const {
  improveSummary,
  improveExperience,
  improveProject,
  suggestSkills,
  analyzeJob,
  scoreResume,
} = require("../controllers/aiController");
const { requireAuth } = require("../middleware/auth");
const { aiRateLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.use(requireAuth, aiRateLimiter);

router.post("/improve-summary", improveSummary);
router.post("/improve-experience", improveExperience);
router.post("/improve-project", improveProject);
router.post("/suggest-skills", suggestSkills);
router.post("/analyze-job", analyzeJob);
router.post("/score-resume", scoreResume);

module.exports = router;
