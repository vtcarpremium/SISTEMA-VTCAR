
import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import { hashPassword, type UserRole } from "../../../../lib/auth";
import {
  requirePermission,
  AuthorizationError,
} from "../../../../lib/authorization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_ROLES: UserRole[] = [
  "master",
  "admin",
  "manager",
  "employee",
];

export async function GET() {
  try {
    await requirePermission("users.view");

    const result = await query(
      `SELECT
        id,
        name,
        email,
        role,
        active,
        last_login_at,
        created_at,
        updated_at
       FROM users
       ORDER BY created_at DESC`
    );

    return NextResponse.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    console.error("Erro ao consultar usuários:", error);

    return NextResponse.json(
      { success: false, message: "Não foi possível consultar os usuários." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requirePermission("users.create");

    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Dados inválidos." },
        { status: 400 }
      );
    }

    const { name, email, password, role } = body;

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 120
    ) {
      return NextResponse.json(
        { success: false, message: "Informe um nome válido." },
        { status: 400 }
      );
    }

    if (
      typeof email !== "string" ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return NextResponse.json(
        { success: false, message: "Informe um e-mail válido." },
        { status: 400 }
      );
    }

    if (
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 72 ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A senha deve ter pelo menos 8 caracteres e um símbolo especial.",
        },
        { status: 400 }
      );
    }

    if (
      typeof role !== "string" ||
      !VALID_ROLES.includes(role as UserRole)
    ) {
      return NextResponse.json(
        { success: false, message: "Perfil de acesso inválido." },
        { status: 400 }
      );
    }

    if (
      currentUser.role !== "master" &&
      (role === "master" || role === "admin")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Somente o MASTER pode criar contas MASTER ou ADMIN.",
        },
        { status: 403 }
      );
    }

    const passwordHash = await hashPassword(password);

    const result = await query(
      `INSERT INTO users (
        name,
        email,
        password_hash,
        role,
        active
      )
      VALUES ($1, $2, $3, $4, TRUE)
      RETURNING id, name, email, role, active, created_at`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        passwordHash,
        role,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Usuário criado com sucesso.",
        user: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        { success: false, message: "Já existe um usuário com esse e-mail." },
        { status: 409 }
      );
    }

    console.error("Erro ao criar usuário:", error);

    return NextResponse.json(
      { success: false, message: "Não foi possível criar o usuário." },
      { status: 500 }
    );
  }
}
