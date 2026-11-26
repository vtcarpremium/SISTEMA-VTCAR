
import Link from "next/link";
import { ShieldX, ArrowLeft, LockKeyhole } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <main className="min-h-screen bg-[#090909] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#FF6B00]/30 bg-[#FF6B00]/10">
          <ShieldX size={38} className="text-[#FF6B00]" />
        </div>

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#FF6B00]">
          VTCAR PREMIUM
        </p>

        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Acesso não autorizado
        </h1>

        <p className="mb-8 text-sm leading-7 text-gray-400">
          Sua conta não possui as permissões necessárias para acessar
          esta área do sistema. Entre em contato com o administrador
          para solicitar autorização.
        </p>

        <div className="mb-8 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#141414] p-4 text-left">
          <LockKeyhole className="shrink-0 text-[#FF6B00]" size={22} />
          <p className="text-xs leading-5 text-gray-400">
            A segurança e o controle de acesso são prioridades
            da VTCAR PREMIUM.
          </p>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D95700]"
        >
          <ArrowLeft size={17} />
          Voltar ao painel
        </Link>
      </div>
    </main>
  );
}
