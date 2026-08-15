import "dotenv/config";
import { randomUUID } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@libsql/client";

const MIGRATIONS_DIR = join(import.meta.dirname, "..", "prisma", "migrations");

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        "id"                    TEXT PRIMARY KEY NOT NULL,
        "checksum"              TEXT NOT NULL,
        "finished_at"           DATETIME,
        "migration_name"        TEXT NOT NULL,
        "logs"                  TEXT,
        "rolled_back_at"        DATETIME,
        "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
        "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
    )
  `);

  const applied = await client.execute(
    `SELECT migration_name FROM "_prisma_migrations"`,
  );
  const alreadyApplied = new Set(applied.rows.map((r) => r.migration_name));

  const migrationDirs = readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const name of migrationDirs) {
    if (alreadyApplied.has(name)) {
      console.log(`skip (already applied): ${name}`);
      continue;
    }

    const sql = readFileSync(join(MIGRATIONS_DIR, name, "migration.sql"), "utf8");
    const checksum = await checksumFor(sql);

    console.log(`applying: ${name}`);
    await client.executeMultiple(sql);

    await client.execute({
      sql: `INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, applied_steps_count) VALUES (?, ?, current_timestamp, ?, 1)`,
      args: [randomUUID(), checksum, name],
    });
  }

  console.log("done.");
  client.close();
}

async function checksumFor(sql) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(sql));
  return Buffer.from(digest).toString("hex");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
