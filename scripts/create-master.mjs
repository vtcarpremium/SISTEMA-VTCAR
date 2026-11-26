
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const email = "atendimento.vtcar@gmail.com";
const name = "Administrador MASTER";

if (!connectionString) {
  throw new Error("DATABASE_URL não configurada.");
}

const pool = new Pool({
  connectionString,
  max: 1,
  connectionTimeoutMillis: 15000,
});

async function createMaster() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "SELECT pg_advisory_xact_lock(hashtext($1))",
      [email]
    );

    const existing = await client.query(
      `SELECT id, role
       FROM users
       WHERE LOWER(email) = LOWER($1)
       LIMIT 1`,
      [email]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].role !== "master") {
        throw new Error(
          "O e-mail MASTER já existe com outro perfil. Verifique o cadastro antes de continuar."
        );
      }

      await client.query("COMMIT");
      console.log("[VTCAR] Usuário MASTER já existe. Nenhuma alteração realizada.");
      return;
    }

    const password = process.env.MASTER_PASSWORD;

    if (!password || password.length < 8 || password.length > 72) {
      throw new Error(
        "Configure MASTER_PASSWORD com pelo menos 8 caracteres e no máximo 72."
      );
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      throw new Error(
        "MASTER_PASSWORD precisa conter pelo menos um símbolo especial."
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await client.query(
      `INSERT INTO users (
        name,
        email,
        password_hash,
        role,
        active,
        failed_login_attempts
      )
      VALUES ($1, $2, $3, 'master', TRUE, 0)`,
      [name, email, passwordHash]
    );

    await client.query("COMMIT");

    console.log("[VTCAR] Usuário MASTER criado com sucesso.");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

try {
  await createMaster();
} catch (error) {
  console.error("[VTCAR] Falha ao criar MASTER:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
