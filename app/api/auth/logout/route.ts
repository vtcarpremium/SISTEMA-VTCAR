import { NextResponse } from "next/server";
import { destroySession } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
      message: "Logout realizado com sucesso.",
    });
  } catch (error) {
    console.error("Erro no logout:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Não foi possível encerrar a sessão.",
      },
      { status: 500 }
    );
  }
}
