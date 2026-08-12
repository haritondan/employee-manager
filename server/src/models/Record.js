import { pool } from "../db.js";
import { ALLOWED_SORT_COLUMNS } from "../utils.js";

export const RecordModel = {
  queryAllRecord: async (sortBy, order, search, page, limit) => {
    const safeSortBy = ALLOWED_SORT_COLUMNS.includes(sortBy) ? sortBy : "id";
    const safeOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";
    const searchPattern = `%${search}%`;
    const safeLimit = Math.max(1, Number(limit) || 10);
    const safePage = Math.max(1, Number(page) || 1);

    const offset = (safePage - 1) * safeLimit;

    const countQuery = pool.query(
      `SELECT COUNT(*) FROM records WHERE name ILIKE $1;`,
      [searchPattern],
    );

    const dataQuery = pool.query(
      `
    SELECT * FROM records
    WHERE name ILIKE $1 
    ORDER BY ${safeSortBy} ${safeOrder}
    LIMIT $2 OFFSET $3;
    `,
      [searchPattern, safeLimit, offset],
    );

    const [countResult, dataResult] = await Promise.all([
      countQuery,
      dataQuery,
    ]);

    const totalRecords = Number(countResult.rows[0].count);
    const totalPages = Math.ceil(totalRecords / safeLimit);

    return {
      data: dataResult.rows,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: safePage,
        limit: safeLimit,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
    };
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
