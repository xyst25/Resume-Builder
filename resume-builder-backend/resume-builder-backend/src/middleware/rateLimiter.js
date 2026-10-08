const rateLimit = require("express-rate-limit");

// AI calls cost money and hit an external API, so they get a tighter limit.
const aiRateLimiter = rateLimit({
  windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60_000,
  max: Number(process.env.AI_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: {
    success: false,
    message: "Too many AI requests. Please wait a moment and try again.",
  },
});

// Looser limiter for auth endpoints to slow down brute-force attempts.
const authRateLimiter = rateLimit({
  windowMs: 15 * 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});

module.exports = { aiRateLimiter, authRateLimiter };
