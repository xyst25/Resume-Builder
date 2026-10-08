const express = require("express");
const {
  listResumes,
  createResume,
  getResume,
  updateResume,
  deleteResume,
  duplicateResume,
  listVersions,
  restoreVersion,
} = require("../controllers/resumeController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Every resume route requires auth; ownership is enforced in the controller.
router.use(requireAuth);

router.get("/", listResumes);
router.post("/", createResume);
router.get("/:id", getResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);
router.post("/:id/duplicate", duplicateResume);

router.get("/:id/versions", listVersions);
router.post("/:id/versions/:versionId/restore", restoreVersion);

module.exports = router;
