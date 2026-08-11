import pkg from "pg";
import { faker } from "@faker-js/faker";
import { statuses } from "./utils.js";

const { Pool } = pkg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://app_user:app_password@localhost:5432/mega_lorem",
});

const recordsQueries = {
  createRecordsTable: `
      CREATE TABLE IF NOT EXISTS records (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        department VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Pending')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  getRecords: `SELECT COUNT(*) FROM records`,
  insertRecord: `
        INSERT INTO records (name, email, department, role, status)
        VALUES ($1, $2, $3, $4, $5);
      `,
};

export async function initDatabase() {
  const client = await pool.connect();
  const { insertRecord, createRecordsTable, getRecords } = recordsQueries;

  try {
    await client.query(createRecordsTable);
    const countResult = await client.query(getRecords);
    const rowCount = parseInt(countResult.rows[0].count, 10);

    if (rowCount === 0) {
      console.log("Seeding 200 records into PostgreSQL...");
      await client.query("BEGIN");

      for (let i = 0; i < 200; i++) {
        const name = faker.person.fullName();
        const email = faker.internet.email();
        const department = faker.commerce.department();
        const role = faker.person.jobTitle();
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        await client.query(insertRecord, [
          name,
          email,
          department,
          role,
          status,
        ]);
      }

      await client.query("COMMIT");
      console.log("Successfully seeded 200 records.");
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database initialization error:", error);
    throw error;
  } finally {
    client.release();
  }
}
