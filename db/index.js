import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";

const dbPath = process.env.DATABASE_URL || "data/nexotask.db";
const dir = path.dirname(dbPath);

if (dir && dir !== ".") {
  fs.mkdirSync(dir, { recursive: true });
}

const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });
export { sqlite };
