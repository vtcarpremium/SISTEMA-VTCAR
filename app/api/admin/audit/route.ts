
import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import {
  requirePermission,
  AuthorizationError,
} from "../../../../lib/authorization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export async function GET(request: NextRequest) {
  try {
    await requirePermission("audit.view");

    const requestedPage = Number(
      request.nextUrl.searchParams.get("page") ?? "1"
    );

    if (
      !Number.isInteger(requestedPage) ||
      requestedPage < 1 ||
      requestedPage > 100000
    ) {
      return NextResponse.json(
        { success: false, message: "Número de página inválido." },
        { status: 400 }
      );
    }

    const offset = (requestedPage - 1) * PAGE_SIZE;

    const [logsResult, countResult] = await Promise.all([
      query(
        `SELECT
          a.id,
          a.user_id,
          u.name AS user_name,
          u.email AS user_email,
          a.action,
          a.entity,
          a.entity_id,
          a.details,
          a.ip_address,
          a.user_agent,
          a.created_at
        FROM audit_logs a
        LEFT JOIN users u ON u.id = a.user_id
        ORDER BY a.created_at DESC
        LIMIT $1 OFFSET $2`,
        [PAGE_SIZE, offset]
      ),

      query(
        `SELECT COUNT(*)::int AS total
         FROM audit_logs`
      ),
    ]);

    const total = countResult.rows[0]?.total ?? 0;

    return NextResponse.json({
      success: true,
      logs: logsResult.rows,
      pagination: {
        page: requestedPage,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    console.error("Erro ao consultar auditoria:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Não foi possível consultar o histórico de auditoria.",
      },
      { status: 500 }
    );
  }
}
