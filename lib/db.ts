
import { Pool, QueryResult, QueryResultRow } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL não configurada. Verifique as variáveis de ambiente do Railway."
  );
}

declare global {
  // Evita criar múltiplos pools durante o hot reload do Next.js.
  // eslint-disable-next-line no-var
  var postgresPool: Pool | undefined;
}

const pool =
  globalThis.postgresPool ??
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.postgresPool = pool;
}

pool.on("error", (error) => {
  console.error("Erro inesperado no pool PostgreSQL:", error.message);
});

/**
 * Executa consultas parametrizadas no PostgreSQL.
 * Utilize exclusivamente em código executado no servidor.
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

/**
 * Disponibiliza o pool para transações e operações avançadas.
 */
export { pool };
