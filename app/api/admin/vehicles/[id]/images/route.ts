
import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../../../lib/db";
import {
  requirePermission,
  AuthorizationError,
} from "../../../../../../lib/authorization";
import {
  createVehicleImageKey,
  uploadVehicleImage,
  validateImage,
} from "../../../../../../lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let uploadedKey: string | null = null;

  try {
    await requirePermission("vehicles.edit");

    const { id } = await params;

    if (!validId(id)) {
      return NextResponse.json(
        { success: false, message: "Identificador de veículo inválido." },
        { status: 400 }
      );
    }

    const vehicle = await query(
      "SELECT id FROM vehicles WHERE id = $1 LIMIT 1",
      [id]
    );

    if (vehicle.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Veículo não encontrado." },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const isCover = formData.get("isCover") === "true";
    const altText = formData.get("altText");

    if (!file || typeof file === "string" || !("arrayBuffer" in file)) {
      return NextResponse.json(
        { success: false, message: "Selecione uma imagem para enviar." },
        { status: 400 }
      );
    }

    if (!validateImage(file.type, file.size)) {
      return NextResponse.json(
        {
          success: false,
          message: "Formato inválido ou arquivo maior que 8 MB. Use JPEG, PNG, WebP ou AVIF.",
        },
        { status: 400 }
      );
    }

    if (
      altText !== null &&
      (typeof altText !== "string" || altText.length > 255)
    ) {
      return NextResponse.json(
        { success: false, message: "Descrição da imagem inválida." },
        { status: 400 }
      );
    }

    const countResult = await query<{ total: string }>(
      `SELECT COUNT(*)::text AS total
       FROM vehicle_images
       WHERE vehicle_id = $1`,
      [id]
    );

    const totalImages = Number(countResult.rows[0]?.total || 0);

    if (totalImages >= 30) {
      return NextResponse.json(
        { success: false, message: "Limite de 30 fotos por veículo atingido." },
        { status: 400 }
      );
    }

    const key = createVehicleImageKey(id, file.type);
    uploadedKey = key;

    const buffer = Buffer.from(await file.arrayBuffer());

    await uploadVehicleImage(key, buffer, file.type);

    const shouldBeCover = isCover || totalImages === 0;

    if (shouldBeCover) {
      await query(
        `UPDATE vehicle_images
         SET is_cover = FALSE
         WHERE vehicle_id = $1`,
        [id]
      );
    }

    const result = await query(
      `INSERT INTO vehicle_images (
         vehicle_id,
         image_url,
         storage_key,
         alt_text,
         position,
         is_cover
       )
       VALUES (
         $1,
         $2,
         $3,
         $4,
         $5,
         $6
       )
       RETURNING id, vehicle_id, storage_key, alt_text, position, is_cover`,
      [
        id,
        `storage://${key}`,
        key,
        typeof altText === "string" ? altText.trim() || null : null,
        totalImages,
        shouldBeCover,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Foto enviada com sucesso.",
        image: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    if (uploadedKey) {
      try {
        const { deleteVehicleImage } = await import(
          "../../../../../../lib/storage"
        );
        await deleteVehicleImage(uploadedKey);
      } catch (cleanupError) {
        console.error("Erro ao limpar imagem não cadastrada:", cleanupError);
      }
    }

    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    console.error("Erro ao enviar foto do veículo:", error);

    return NextResponse.json(
      { success: false, message: "Não foi possível enviar a foto." },
      { status: 500 }
    );
  }
}
