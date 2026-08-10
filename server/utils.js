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

export const validateColumn = (column) =>
  ALLOWED_SORT_COLUMNS.includes(column) ? column : "id";

export const statuses = ["Active", "Inactive", "Pending"];
