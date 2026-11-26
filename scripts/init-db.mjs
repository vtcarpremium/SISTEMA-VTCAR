
import { Pool } from "pg";
import { readFile } from "node:fs/promises";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "ERRO: DATABASE_URL não está configurada no ambiente."
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 1,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 10000,
});

async function initializeDatabase() {
  try {
    console.log("[VTCAR] Iniciando configuração do PostgreSQL...");

    const schemaUrl = new URL(
      "../database/schema.sql",
      import.meta.url
    );

    const schema = await readFile(schemaUrl, "utf8");

    if (!schema.trim()) {
      throw new Error("O arquivo schema.sql está vazio.");
    }

    await pool.query(schema);

    console.log(
      "[VTCAR] Estrutura do banco criada ou verificada com sucesso."
    );
  } catch (error) {
    console.error(
      "[VTCAR] Falha ao inicializar o banco:",
      error.message
    );

    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

await initializeDatabase();
