import express from "express";
import { validateColumn } from "../utils.js";
import { pool } from "../db.js";
import recordsController from "../controllers/recordsController.js";

const router = express.Router();

router.get("/", recordsController.getAllRecords);
router.get("/:id", recordsController.getRecordById);
router.post("/", recordsController.createRecord);
router.put("/:id", recordsController.updateRecord);
router.delete("/:id", recordsController.deleteRecord);

export default router;
