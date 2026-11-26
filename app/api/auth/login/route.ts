
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import {
  createSession,
  verifyPassword,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dados de acesso inválidos." },
      { status: 400 }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("email" in body) ||
    !("password" in body)
  ) {
    return NextResponse.json(
      { error: "Informe e-mail e senha." },
      { status: 400 }
    );
  }

  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  if (
    !email ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !password ||
    password.length > 72
  ) {
    return NextResponse.json(
      { error: "E-mail ou senha inválidos." },
      { status: 400 }
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `SELECT id, name, email, password_hash, role,
              active, failed_login_attempts, locked_until
       FROM users
       WHERE LOWER(email) = $1
       LIMIT 1
       FOR UPDATE`,
      [email]
    );

    const user = result.rows[0];

    if (!user || !user.active) {
      await client.query("COMMIT");

      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    if (
      user.locked_until &&
      new Date(user.locked_until).getTime() > Date.now()
    ) {
      await client.query("COMMIT");

      return NextResponse.json(
        {
          error:
            "Acesso temporariamente bloqueado. Tente novamente mais tarde.",
        },
        { status: 429 }
      );
    }

    const passwordIsValid = await verifyPassword(
      password,
      user.password_hash
    );

    if (!passwordIsValid) {
      const attempts =
        Number(user.failed_login_attempts || 0) + 1;

      if (attempts >= 5) {
        await client.query(
          `UPDATE users
           SET failed_login_attempts = 0,
               locked_until = NOW() + INTERVAL '15 minutes'
           WHERE id = $1`,
          [user.id]
        );

        await client.query("COMMIT");

        return NextResponse.json(
          {
            error:
              "Muitas tentativas. Acesso bloqueado por 15 minutos.",
          },
          { status: 429 }
        );
      }

      await client.query(
        `UPDATE users
         SET failed_login_attempts = $1
         WHERE id = $2`,
        [attempts, user.id]
      );

      await client.query("COMMIT");

      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    await client.query(
      `UPDATE users
       SET failed_login_attempts = 0,
           locked_until = NULL,
           last_login_at = NOW()
       WHERE id = $1`,
      [user.id]
    );

    await client.query("COMMIT");

    await createSession({ id: user.id });

    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);

    console.error("[VTCAR] Erro no login:", error);

    return NextResponse.json(
      { error: "Não foi possível realizar o login." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
