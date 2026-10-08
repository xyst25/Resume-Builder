const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { query } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const SALT_ROUNDS = 12;

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function toPublicUser(row) {
  return { id: row.id, name: row.name, email: row.email, createdAt: row.created_at };
}

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "name, email and password are required");
  }
  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const existing = await query("SELECT id FROM users WHERE email = $1", [
    email.toLowerCase(),
  ]);
  if (existing.rows.length > 0) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name.trim(), email.toLowerCase().trim(), passwordHash]
  );

  const user = rows[0];
  const token = signToken(user);

  res.status(201).json({ success: true, token, user: toPublicUser(user) });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "email and password are required");
  }

  const { rows } = await query("SELECT * FROM users WHERE email = $1", [
    email.toLowerCase().trim(),
  ]);
  const user = rows[0];

  // Same error for "no user" and "wrong password" to avoid leaking which emails exist.
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user);
  res.json({ success: true, token, user: toPublicUser(user) });
});

// POST /api/auth/forgot-password
// Generates a reset token. Actually emailing it out is left to your
// transactional email provider (SendGrid, Postmark, Supabase Auth, etc.).
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "email is required");

  const { rows } = await query("SELECT id FROM users WHERE email = $1", [
    email.toLowerCase().trim(),
  ]);

  // Always respond success-shaped, even if the email doesn't exist,
  // so attackers can't use this endpoint to enumerate accounts.
  if (rows.length === 0) {
    return res.json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await query(
    `UPDATE users SET reset_token = $1, reset_token_expires_at = $2 WHERE id = $3`,
    [resetToken, expiresAt, rows[0].id]
  );

  // TODO: send `resetToken` via email instead of returning it directly.
  res.json({
    success: true,
    message: "If that email exists, a reset link has been sent.",
    devOnlyResetToken:
      process.env.NODE_ENV === "development" ? resetToken : undefined,
  });
});

// POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    throw new ApiError(400, "token and newPassword are required");
  }
  if (newPassword.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const { rows } = await query(
    `SELECT id FROM users
     WHERE reset_token = $1 AND reset_token_expires_at > now()`,
    [token]
  );
  if (rows.length === 0) {
    throw new ApiError(400, "Reset token is invalid or has expired");
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await query(
    `UPDATE users
     SET password_hash = $1, reset_token = NULL, reset_token_expires_at = NULL
     WHERE id = $2`,
    [passwordHash, rows[0].id]
  );

  res.json({ success: true, message: "Password updated. You can now log in." });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  const { rows } = await query(
    "SELECT id, name, email, created_at FROM users WHERE id = $1",
    [req.user.id]
  );
  if (rows.length === 0) throw new ApiError(404, "User not found");
  res.json({ success: true, user: toPublicUser(rows[0]) });
});

module.exports = { register, login, forgotPassword, resetPassword, me };
