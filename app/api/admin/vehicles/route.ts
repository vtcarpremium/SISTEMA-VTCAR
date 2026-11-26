
import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import { writeAuditLog } from "../../../../lib/audit";
import {
  requirePermission,
  AuthorizationError,
} from "../../../../lib/authorization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const vehicleStatuses = ["draft", "published", "paused", "sold"] as const;

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isValidText(value: unknown, maxLength: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

function optionalText(
  value: unknown,
  maxLength: number
): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string" || value.length > maxLength) {
    throw new Error("INVALID_OPTIONAL_FIELD");
  }

  return value.trim();
}

export async function GET() {
  try {
    await requirePermission("vehicles.view");

    const result = await query(
      `SELECT
        id, title, slug, brand, model, version,
        manufacture_year, model_year, price, mileage,
        transmission, fuel_type, color, description,
        status, featured, created_at, updated_at
       FROM vehicles
       ORDER BY created_at DESC`
    );

    return NextResponse.json({
      success: true,
      vehicles: result.rows,
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    console.error("Erro ao consultar veículos:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Não foi possível consultar os veículos.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission("vehicles.create");
    const body = await request.json();

    const {
      title,
      brand,
      model,
      version,
      manufactureYear,
      modelYear,
      price,
      mileage,
      transmission,
      fuelType,
      color,
      description,
      status,
      featured,
    } = body ?? {};

    if (!isValidText(title, 180)) {
      return NextResponse.json(
        { success: false, message: "Informe um título válido." },
        { status: 400 }
      );
    }

    if (!isValidText(brand, 80) || !isValidText(model, 100)) {
      return NextResponse.json(
        {
          success: false,
          message: "Marca e modelo são obrigatórios.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(manufactureYear) ||
      !Number.isInteger(modelYear) ||
      manufactureYear < 1900 ||
      modelYear < 1900 ||
      manufactureYear > 2100 ||
      modelYear > 2100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Informe os anos de fabricação e modelo corretamente.",
        },
        { status: 400 }
      );
    }

    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price <= 0 ||
      price > 100000000
    ) {
      return NextResponse.json(
        { success: false, message: "Informe um preço válido." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(mileage) ||
      mileage < 0 ||
      mileage > 10000000
    ) {
      return NextResponse.json(
        { success: false, message: "Informe uma quilometragem válida." },
        { status: 400 }
      );
    }

    const vehicleStatus = status === undefined ? "draft" : status;

    if (!vehicleStatuses.includes(vehicleStatus)) {
      return NextResponse.json(
        { success: false, message: "Status do veículo inválido." },
        { status: 400 }
      );
    }

    if (featured !== undefined && typeof featured !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "O campo de destaque deve ser verdadeiro ou falso.",
        },
        { status: 400 }
      );
    }

    let safeVersion: string | null;
    let safeTransmission: string | null;
    let safeFuelType: string | null;
    let safeColor: string | null;
    let safeDescription: string | null;

    try {
      safeVersion = optionalText(version, 100);
      safeTransmission = optionalText(transmission, 60);
      safeFuelType = optionalText(fuelType, 60);
      safeColor = optionalText(color, 60);
      safeDescription = optionalText(description, 5000);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Um dos campos de texto excede o limite permitido.",
        },
        { status: 400 }
      );
    }

    const slug = `${slugify(title)}-${crypto.randomUUID().slice(0, 8)}`;

    const result = await query(
      `INSERT INTO vehicles (
        title,
        slug,
        brand,
        model,
        version,
        manufacture_year,
        model_year,
        price,
        mileage,
        transmission,
        fuel_type,
        color,
        description,
        status,
        featured,
        published_at,
        created_by,
        updated_by
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15,
        CASE WHEN $14 = 'published' THEN NOW() ELSE NULL END,
        $16, $16
      )
      RETURNING *`,
      [
        title.trim(),
        slug,
        brand.trim(),
        model.trim(),
        safeVersion,
        manufactureYear,
        modelYear,
        price,
        mileage,
        safeTransmission,
        safeFuelType,
        safeColor,
        safeDescription,
        vehicleStatus,
        featured === true,
        user.id,
      ]
    );

    const vehicle = result.rows[0];

    try {
      await writeAuditLog({
        userId: user.id,
        action: "vehicle.created",
        entity: "vehicle",
        entityId: vehicle.id,
        details: {
          title: vehicle.title,
          brand: vehicle.brand,
          model: vehicle.model,
          status: vehicle.status,
        },
        ipAddress: request.headers.get("x-forwarded-for"),
        userAgent: request.headers.get("user-agent"),
      });
    } catch (auditError) {
      console.error(
        "Falha ao registrar auditoria do veículo:",
        auditError
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Veículo cadastrado com sucesso.",
        vehicle,
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

    console.error("Erro ao cadastrar veículo:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Não foi possível cadastrar o veículo.",
      },
      { status: 500 }
    );
  }
}
