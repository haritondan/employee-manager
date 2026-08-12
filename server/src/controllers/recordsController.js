import express from "express";
import { RecordService } from "../services/recordsService.js";
import { asyncHandler } from "../utils.js";

const getAllRecords = asyncHandler(async (req, res) => {
  const {
    search = "",
    sortBy = "id",
    order = "asc",
    page = 1,
    limit = 10,
  } = req.query;
  const records = await RecordService.getAllRecords(
    sortBy,
    order,
    search,
    page,
    limit,
  );
  res.json(records);
});

const getRecordById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const record = await RecordService.getRecordById(id);

  if (!record) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json(record);
});

const createRecord = asyncHandler(async (req, res) => {
  const { name, email, department, role, status } = req.body;

  const record = await RecordService.createRecord(req.body);
  res.status(201).json(record);
});

const updateRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, department, role, status } = req.body;

  const record = await RecordService.updateRecord({ id, ...req.body });

  if (!record) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json(record);
});

const deleteRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await RecordService.deleteRecord(id);

  if (!record) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json({ message: "Item deleted successfully", id });
});

export default {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};
