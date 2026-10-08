const ApiError = require("../utils/ApiError");

// 404 fallback for unmatched routes
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Final error handler. Keeps internal error details out of the response
// in production, but logs them server-side.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;

  if (!isApiError) {
    console.error("[unhandled error]", err);
  }

  res.status(statusCode).json({
    success: false,
    message: isApiError ? err.message : "Something went wrong on our end.",
    details: isApiError ? err.details : undefined,
  });
}

module.exports = { notFound, errorHandler };
