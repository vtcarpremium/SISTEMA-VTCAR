
import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../../lib/db";
import {
  requirePermission,
  AuthorizationError,
} from "../../../../../lib/authorization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statuses = ["draft", "published", "paused", "sold"];

const allowedFields: Record<string, string> = {
  title: "title",
  brand: "brand",
  model: "model",
  version: "version",
  manufactureYear: "manufacture_year",
  modelYear: "model_year",
  price: "price",
  mileage: "mileage",
  transmission: "transmission",
  fuelType: "fuel_type",
  color: "color",
  description: "description",
  status: "status",
  featured: "featured",
};

function validId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function validateField(key: string, value: unknown): boolean {
  if (key === "title") {
    return typeof value === "string" && value.trim().length > 0 && value.length <= 180;
  }

  if (key === "brand") {
    return typeof value === "string" && value.trim().length > 0 && value.length <= 80;
  }

  if (key === "model") {
    return typeof value === "string" && value.trim().length > 0 && value.length <= 100;
  }

  if (key === "version") return value === null || (typeof value === "string" && value.length <= 100);
  if (key === "transmission") return value === null || (typeof value === "string" && value.length <= 60);
  if (key === "fuelType") return value === null || (typeof value === "string" && value.length <= 60);
  if (key === "color") return value === null || (typeof value === "string" && value.length <= 60);
  if (key === "description") return value === null || (typeof value === "string" && value.length <= 5000);

  if (key === "manufactureYear" || key === "modelYear") {
    return Number.isInteger(value) && Number(value) >= 1900 && Number(value) <= 2100;
  }

  if (key === "price") {
    return typeof value === "number" && Number.isFinite(value) && value > 0 && value <= 100000000;
  }

  if (key === "mileage") {
    return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 10000000;
  }

  if (key === "status") {
    return typeof value === "string" && statuses.includes(value);
  }

  if (key === "featured") {
    return typeof value === "boolean";
  }

  return false;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("vehicles.edit");

    const { id } = await params;

    if (!validId(id)) {
      return NextResponse.json(
        { success: false, message: "Identificador de veículo inválido." },
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

    const entries = Object.entries(body);

    if (entries.length === 0) {
      return NextResponse.json(
        { success: false, message: "Informe ao menos um campo para atualizar." },
        { status: 400 }
      );
    }

    const assignments: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of entries) {
      const column = allowedFields[key];

      if (!column || !validateField(key, value)) {
        return NextResponse.json(
          { success: false, message: `Campo inválido: ${key}.` },
          { status: 400 }
        );
      }

      values.push(typeof value === "string" ? value.trim() : value);
      assignments.push(`${column} = $${values.length}`);
    }

    if (Object.prototype.hasOwnProperty.call(body, "status")) {
      values.push(body.status === "published" ? new Date() : null);
      assignments.push(`published_at = $${values.length}`);
    }

    assignments.push("updated_at = NOW()");

    values.push(id);

    const result = await query(
      `UPDATE vehicles
       SET ${assignments.join(", ")}
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Veículo não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Veículo atualizado com sucesso.",
      vehicle: result.rows[0],
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    console.error("Erro ao atualizar veículo:", error);

    return NextResponse.json(
      { success: false, message: "Não foi possível atualizar o veículo." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("vehicles.delete");

    const { id } = await params;

    if (!validId(id)) {
      return NextResponse.json(
        { success: false, message: "Identificador de veículo inválido." },
        { status: 400 }
      );
    }

    const result = await query(
      `DELETE FROM vehicles
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Veículo não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Veículo excluído com sucesso.",
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    console.error("Erro ao excluir veículo:", error);

    return NextResponse.json(
      { success: false, message: "Não foi possível excluir o veículo." },
      { status: 500 }
    );
  }
}
