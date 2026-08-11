import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase } from "./db.js";
import records from "./routes/records.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// TODO: add dotenv pkg
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/records", records);

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to database init error:", err);
    process.exit(1);
  });
