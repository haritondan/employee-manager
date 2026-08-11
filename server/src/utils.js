// Whitelist allowed sort columns to prevent SQL injection
export const ALLOWED_SORT_COLUMNS = [
  "id",
  "name",
  "email",
  "department",
  "role",
  "status",
  "created_at",
];

export const statuses = ["Active", "Inactive", "Pending"];

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  // Log the full stack trace for debugging
  console.error(err.stack);

  // Return a clean, standardized JSON response to the client
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
  });
};
