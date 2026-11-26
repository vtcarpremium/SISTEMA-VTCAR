
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
    await requirePermission("leads.view");

    const searchParams = request.nextUrl.searchParams;
    const requestedPage = Number(searchParams.get("page") ?? "1");

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

    const [leadsResult, countResult] = await Promise.all([
      query(
        `SELECT
          l.id,
          l.name,
          l.email,
          l.phone,
          l.message,
          l.source,
          l.status,
          l.consent_at,
          l.assigned_to,
          l.created_at,
          l.updated_at,
          v.id AS vehicle_id,
          v.title AS vehicle_title,
          u.name AS assigned_user_name
        FROM leads l
        LEFT JOIN vehicles v ON v.id = l.vehicle_id
        LEFT JOIN users u ON u.id = l.assigned_to
        ORDER BY
          CASE WHEN l.status = 'new' THEN 0 ELSE 1 END,
          l.created_at DESC
        LIMIT $1 OFFSET $2`,
        [PAGE_SIZE, offset]
      ),

      query(
        `SELECT COUNT(*)::int AS total
         FROM leads`
      ),
    ]);

    const total = countResult.rows[0]?.total ?? 0;

    return NextResponse.json({
      success: true,
      leads: leadsResult.rows,
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

    console.error("Erro ao consultar leads:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Não foi possível consultar os contatos.",
      },
      { status: 500 }
    );
  }
}
