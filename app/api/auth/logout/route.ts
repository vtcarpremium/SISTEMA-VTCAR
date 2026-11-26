
import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
      message: "Sessão encerrada com sucesso.",
    });
  } catch (error) {
    console.error("[VTCAR] Erro ao encerrar sessão:", error);

    return NextResponse.json(
      { error: "Não foi possível encerrar a sessão." },
      { status: 500 }
    );
  }
}
