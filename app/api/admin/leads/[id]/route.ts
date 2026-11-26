
import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../../lib/db";
import {
  requirePermission,
  AuthorizationError,
} from "../../../../../lib/authorization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "negotiating",
  "converted",
  "lost",
];

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("leads.manage");

    const { id } = await params;

    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { success: false, message: "Identificador de lead inválido." },
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

    const allowedKeys = ["status", "assignedTo"];
    const keys = Object.keys(body);

    if (
      keys.length === 0 ||
      keys.some((key) => !allowedKeys.includes(key))
    ) {
      return NextResponse.json(
        { success: false, message: "Informe campos válidos para atualizar." },
        { status: 400 }
      );
    }

    const assignments: string[] = [];
    const values: unknown[] = [];

    if (Object.prototype.hasOwnProperty.call(body, "status")) {
      if (
        typeof body.status !== "string" ||
        !VALID_STATUSES.includes(body.status)
      ) {
        return NextResponse.json(
          { success: false, message: "Status de atendimento inválido." },
          { status: 400 }
        );
      }

      values.push(body.status);
      assignments.push(`status = $${values.length}`);
    }

    if (Object.prototype.hasOwnProperty.call(body, "assignedTo")) {
      const assignedTo = body.assignedTo;

      if (
        assignedTo !== null &&
        (typeof assignedTo !== "string" || !UUID_REGEX.test(assignedTo))
      ) {
        return NextResponse.json(
          { success: false, message: "Responsável pelo atendimento inválido." },
          { status: 400 }
        );
      }

      if (assignedTo !== null) {
        const userResult = await query(
          `SELECT id
           FROM users
           WHERE id = $1 AND active = TRUE`,
          [assignedTo]
        );

        if (userResult.rows.length === 0) {
          return NextResponse.json(
            { success: false, message: "Usuário responsável não encontrado ou inativo." },
            { status: 400 }
          );
        }
      }

      values.push(assignedTo);
      assignments.push(`assigned_to = $${values.length}`);
    }

    assignments.push("updated_at = NOW()");
    values.push(id);

    const result = await query(
      `UPDATE leads
       SET ${assignments.join(", ")}
       WHERE id = $${values.length}
       RETURNING id, name, email, phone, status, assigned_to, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Lead não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead atualizado com sucesso.",
      lead: result.rows[0],
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    console.error("Erro ao atualizar lead:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Não foi possível atualizar o atendimento.",
      },
      { status: 500 }
    );
  }
}
