const express = require("express");
const multer = require("multer");
const { importResume } = require("../controllers/importController");
const { requireAuth } = require("../middleware/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const router = express.Router();

router.post("/import", requireAuth, upload.single("file"), importResume);

module.exports = router;
