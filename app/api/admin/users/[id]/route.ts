
import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../../lib/db";
import { hashPassword, type UserRole } from "../../../../../lib/auth";
import {
  requirePermission,
  AuthorizationError,
} from "../../../../../lib/authorization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_ROLES: UserRole[] = [
  "master",
  "admin",
  "manager",
  "employee",
];

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requirePermission("users.edit");
    const { id } = await params;

    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { success: false, message: "Identificador de usuário inválido." },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Dados inválidos." },
        { status: 400 }
      );
    }

    const allowedKeys = ["name", "role", "active", "password"];
    const keys = Object.keys(body);

    if (
      keys.length === 0 ||
      keys.some((key) => !allowedKeys.includes(key))
    ) {
      return NextResponse.json(
        { success: false, message: "Campos de atualização inválidos." },
        { status: 400 }
      );
    }

    const existingResult = await query(
      `SELECT id, name, role, active
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const existingUser = existingResult.rows[0];

    if (
      currentUser.role !== "master" &&
      (existingUser.role === "master" || existingUser.role === "admin")
    ) {
      return NextResponse.json(
        { success: false, message: "Você não pode alterar esta conta." },
        { status: 403 }
      );
    }

    if (existingUser.role === "master") {
      if (
        Object.prototype.hasOwnProperty.call(body, "role") ||
        Object.prototype.hasOwnProperty.call(body, "active")
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "A função e o estado da conta MASTER não podem ser alterados por esta operação.",
          },
          { status: 403 }
        );
      }
    }

    if (
      id === currentUser.id &&
      (
        body.active === false ||
        Object.prototype.hasOwnProperty.call(body, "role")
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Você não pode alterar seu próprio perfil ou desativar sua própria conta.",
        },
        { status: 403 }
      );
    }

    const assignments: string[] = [];
    const values: unknown[] = [];

    if (Object.prototype.hasOwnProperty.call(body, "name")) {
      if (
        typeof body.name !== "string" ||
        body.name.trim().length < 2 ||
        body.name.trim().length > 120
      ) {
        return NextResponse.json(
          { success: false, message: "Nome inválido." },
          { status: 400 }
        );
      }

      values.push(body.name.trim());
      assignments.push(`name = $${values.length}`);
    }

    if (Object.prototype.hasOwnProperty.call(body, "role")) {
      if (
        typeof body.role !== "string" ||
        !VALID_ROLES.includes(body.role as UserRole)
      ) {
        return NextResponse.json(
          { success: false, message: "Perfil de acesso inválido." },
          { status: 400 }
        );
      }

      if (
        currentUser.role !== "master" &&
        (body.role === "master" || body.role === "admin")
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Somente o MASTER pode atribuir os perfis MASTER e ADMIN.",
          },
          { status: 403 }
        );
      }

      values.push(body.role);
      assignments.push(`role = $${values.length}`);
    }

    if (Object.prototype.hasOwnProperty.call(body, "active")) {
      if (typeof body.active !== "boolean") {
        return NextResponse.json(
          { success: false, message: "Estado da conta inválido." },
          { status: 400 }
        );
      }

      values.push(body.active);
      assignments.push(`active = $${values.length}`);
    }

    if (Object.prototype.hasOwnProperty.call(body, "password")) {
      if (
        typeof body.password !== "string" ||
        body.password.length < 8 ||
        body.password.length > 72 ||
        !/[^A-Za-z0-9]/.test(body.password)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "A senha deve ter pelo menos 8 caracteres e um símbolo especial.",
          },
          { status: 400 }
        );
      }

      const passwordHash = await hashPassword(body.password);

      values.push(passwordHash);
      assignments.push(`password_hash = $${values.length}`);

      assignments.push("failed_login_attempts = 0");
      assignments.push("locked_until = NULL");
    }

    if (assignments.length === 0) {
      return NextResponse.json(
        { success: false, message: "Nenhuma alteração válida foi informada." },
        { status: 400 }
      );
    }

    assignments.push("updated_at = NOW()");
    values.push(id);

    const result = await query(
      `UPDATE users
       SET ${assignments.join(", ")}
       WHERE id = $${values.length}
       RETURNING id, name, email, role, active, updated_at`,
      values
    );

    return NextResponse.json({
      success: true,
      message: "Usuário atualizado com sucesso.",
      user: result.rows[0],
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    console.error("Erro ao atualizar usuário:", error);

    return NextResponse.json(
      { success: false, message: "Não foi possível atualizar o usuário." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requirePermission("users.delete");
    const { id } = await params;

    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { success: false, message: "Identificador de usuário inválido." },
        { status: 400 }
      );
    }

    if (id === currentUser.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Você não pode excluir sua própria conta.",
        },
        { status: 403 }
      );
    }

    const result = await query(
      `DELETE FROM users
       WHERE id = $1
         AND role <> 'master'
       RETURNING id, name, email`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuário não encontrado ou conta MASTER protegida.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Usuário excluído com sucesso.",
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    console.error("Erro ao excluir usuário:", error);

    return NextResponse.json(
      { success: false, message: "Não foi possível excluir o usuário." },
      { status: 500 }
    );
  }
}
