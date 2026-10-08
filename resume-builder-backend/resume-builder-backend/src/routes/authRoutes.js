const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  me,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const { authRateLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/forgot-password", authRateLimiter, forgotPassword);
router.post("/reset-password", authRateLimiter, resetPassword);
router.get("/me", requireAuth, me);

module.exports = router;
