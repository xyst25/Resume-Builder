const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

// Verifies the Bearer token and attaches { id, email } to req.user.
// Every resume route uses this so a user can only ever act as themselves;
// ownership of a specific resource is checked again in the controller.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Missing or malformed Authorization header"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
}

module.exports = { requireAuth };
