import pkg from "pg";
import { faker } from "@faker-js/faker";
import { statuses } from "./utils.js";

const { Pool } = pkg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://app_user:app_password@localhost:5432/mega_lorem",
});

const itemsQueries = {
  createItemsTable: `
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        department VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Pending')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  selectItemsFromItemsTable: `SELECT COUNT(*) FROM items`,
  insertItem: `
        INSERT INTO items (name, email, department, role, status)
        VALUES ($1, $2, $3, $4, $5);
      `,
};

export async function initDatabase() {
  const client = await pool.connect();
  const { insertItem, createItemsTable, selectItemsFromItemsTable } =
    itemsQueries;

  try {
    await client.query(createItemsTable);
    const countResult = await client.query(selectItemsFromItemsTable);
    const rowCount = parseInt(countResult.rows[0].count, 10);

    // 3. Seed 200 records if empty
    if (rowCount === 0) {
      console.log("Seeding 200 records into PostgreSQL...");
      await client.query("BEGIN");

      for (let i = 0; i < 200; i++) {
        const name = faker.person.fullName();
        const email = faker.internet.email();
        const department = faker.commerce.department();
        const role = faker.person.jobTitle();
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        await client.query(insertItem, [name, email, department, role, status]);
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
