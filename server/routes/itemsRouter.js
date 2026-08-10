import express from "express";
import { validateColumn } from "../utils.js";
import { pool } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search = "", sortBy = "id", order = "asc" } = req.query;

    const safeSortBy = validateColumn(sortBy);
    const safeOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";
    const searchPattern = `%${search}%`;

    const query = `
      SELECT * FROM items
      WHERE name ILIKE $1 
      ORDER BY ${safeSortBy} ${safeOrder};
    `;

    const { rows } = await pool.query(query, [searchPattern]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM items WHERE id = $1", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, department, role, status } = req.body;

    if (!name || !email || !department || !role || !status) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const query = `
      INSERT INTO items (name, email, department, role, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      name,
      email,
      department,
      role,
      status,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create item" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, role, status } = req.body;

    if (!name || !email || !department || !role || !status) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const query = `
      UPDATE items
      SET name = $1, email = $2, department = $3, role = $4, status = $5
      WHERE id = $6
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      name,
      email,
      department,
      role,
      status,
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    ``;
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM items WHERE id = $1", [
      id,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item deleted successfully", id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default router;
