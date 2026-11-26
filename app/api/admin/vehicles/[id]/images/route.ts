
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
  createImageDownloadUrl,
  deleteVehicleImage,
} from "../../../../../../lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

async function checkVehicle(id: string) {
  const result = await query(
    "SELECT id FROM vehicles WHERE id = $1 LIMIT 1",
    [id]
  );
  return result.rows.length > 0;
}

// LISTAR FOTOS
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("vehicles.view");

    const { id } = await params;

    if (!validId(id)) {
      return NextResponse.json(
        { success: false, message: "Identificador inválido." },
        { status: 400 }
      );
    }

    if (!(await checkVehicle(id))) {
      return NextResponse.json(
        { success: false, message: "Veículo não encontrado." },
        { status: 404 }
      );
    }

    const result = await query(
      `SELECT id, vehicle_id, image_url, storage_key,
              alt_text, position, is_cover
       FROM vehicle_images
       WHERE vehicle_id = $1
       ORDER BY is_cover DESC, position ASC, created_at ASC`,
      [id]
    );

    const images = await Promise.all(
      result.rows.map(async (image: any) => ({
        ...image,
        url: image.storage_key
          ? await createImageDownloadUrl(image.storage_key)
          : image.image_url?.startsWith("storage://")
            ? null
            : image.image_url,
      }))
    );

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    console.error("Erro ao listar fotos:", error);

    return NextResponse.json(
      { success: false, message: "Não foi possível listar as fotos." },
      { status: 500 }
    );
  }
}

// ENVIAR FOTO
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
        { success: false, message: "Identificador inválido." },
        { status: 400 }
      );
    }

    if (!(await checkVehicle(id))) {
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
        { success: false, message: "Selecione uma imagem." },
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
        { success: false, message: "Descrição inválida." },
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
         vehicle_id, image_url, storage_key,
         alt_text, position, is_cover
       )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, vehicle_id, storage_key,
                 alt_text, position, is_cover`,
      [
        id,
        `storage://${key}`,
        key,
        typeof altText === "string" ? altText.trim() || null : null,
        totalImages,
        shouldBeCover,
      ]
    );

    uploadedKey = null;

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
        await deleteVehicleImage(uploadedKey);
      } catch (cleanupError) {
        console.error("Erro ao limpar imagem:", cleanupError);
      }
    }

    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    console.error("Erro ao enviar foto:", error);

    return NextResponse.json(
      { success: false, message: "Não foi possível enviar a foto." },
      { status: 500 }
    );
  }
}

// EXCLUIR FOTO
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("vehicles.edit");

    const { id } = await params;
    const imageId = request.nextUrl.searchParams.get("imageId");

    if (!validId(id) || !imageId || !validId(imageId)) {
      return NextResponse.json(
        { success: false, message: "Identificador inválido." },
        { status: 400 }
      );
    }

    if (!(await checkVehicle(id))) {
      return NextResponse.json(
        { success: false, message: "Veículo não encontrado." },
        { status: 404 }
      );
    }

    const result = await query(
      `SELECT id, storage_key, is_cover
       FROM vehicle_images
       WHERE id = $1 AND vehicle_id = $2
       LIMIT 1`,
      [imageId, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Foto não encontrada." },
        { status: 404 }
      );
    }

    const image = result.rows[0];

    if (image.storage_key) {
      await deleteVehicleImage(image.storage_key);
    }

    await query(
      `DELETE FROM vehicle_images
       WHERE id = $1 AND vehicle_id = $2`,
      [imageId, id]
    );

    if (image.is_cover) {
      const nextImage = await query(
        `SELECT id
         FROM vehicle_images
         WHERE vehicle_id = $1
         ORDER BY position ASC, created_at ASC
         LIMIT 1`,
        [id]
      );

      if (nextImage.rows.length > 0) {
        await query(
          `UPDATE vehicle_images
           SET is_cover = (id = $2)
           WHERE vehicle_id = $1`,
          [id, nextImage.rows[0].id]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Foto excluída com sucesso.",
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    console.error("Erro ao excluir foto:", error);

    return NextResponse.json(
      { success: false, message: "Não foi possível excluir a foto." },
      { status: 500 }
    );
  }
}
