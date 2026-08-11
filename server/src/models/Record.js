import { pool } from "../db.js";
import { ALLOWED_SORT_COLUMNS } from "../utils.js";

export const RecordModel = {
  queryAllRecord: async (sortBy, order, search) => {
    const safeSortBy = ALLOWED_SORT_COLUMNS.includes(sortBy) ? sortBy : "id";
    const safeOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";
    const searchPattern = `%${search}%`;

    const { rows } = await pool.query(
      `
      SELECT * FROM records
      WHERE name ILIKE $1 
      ORDER BY ${safeSortBy} ${safeOrder};
    `,
      [searchPattern],
    );
    return rows;
  },

  queryRecordById: async (id) => {
    const { rows } = await pool.query("SELECT * FROM records WHERE id = $1", [
      id,
    ]);
    return rows[0] || null;
  },

  createRecord: async (data) => {
    const { name, email, department, role, status } = data;

    const query = `
      INSERT INTO records (name, email, department, role, status)
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

    return rows[0];
  },

  updateRecord: async (data) => {
    const { id, name, email, department, role, status } = data;

    const query = `
          UPDATE records
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

    return rows[0] || null;
  },

  deleteRecord: async (id) => {
    const { rowCount } = await pool.query("DELETE FROM records WHERE id = $1", [
      id,
    ]);
    return rowCount || null;
  },
};
