import express from "express";
import recordsController from "../controllers/recordsController.js";
import {
  validateCreateRecord,
  validateGetAllRecords,
  validateUpdateRecord,
} from "../validators/recordValidation.js";

const router = express.Router();

router.get("/", validateGetAllRecords, recordsController.getAllRecords);
router.get("/:id", recordsController.getRecordById);
router.post("/", validateCreateRecord, recordsController.createRecord);
router.put("/:id", validateUpdateRecord, recordsController.updateRecord);
router.delete("/:id", recordsController.deleteRecord);

export default router;
