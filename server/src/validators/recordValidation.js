import { query, body, param } from "express-validator";
import { handleValidationErrors } from "./validate.js";
import { ALLOWED_SORT_COLUMNS, statuses } from "../utils.js";

export const validateGetAllRecords = [
  query("search").optional().isString().trim(),
  query("sortBy").optional().isIn(ALLOWED_SORT_COLUMNS),
  query("order").optional().toLowerCase().isIn(["asc", "desc"]),
  query("page").optional().toLowerCase().isString(),
  query("limit").optional().toLowerCase().isString(),
  handleValidationErrors,
];

export const validateCreateRecord = [
  body("name").trim().notEmpty().withMessage("Name is required").isString(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required")
    .isString(),

  body("role").trim().notEmpty().withMessage("Role is required").isString(),

  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(statuses)
    .withMessage(`Status must be one of: ${statuses.join(", ")}`),

  handleValidationErrors,
];

export const validateUpdateRecord = [
  param("id").notEmpty().withMessage("Record ID parameter is required"),
  ...validateCreateRecord,
];
