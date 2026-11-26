"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("atendimento.vtcar@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "E-mail ou senha inválidos.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E1E8F0]">

        {/* LATERAL INSTITUCIONAL */}
        <section className="relative hidden lg:flex flex-col justify-between bg-[#071B35] p-12 text-white overflow-hidden">
          <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full border border-[#55B8FF]/20" />
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-[#55B8FF]/20" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#123B68]/50 blur-3xl" />

          <div className="relative z-10">
            <div className="text-4xl font-black tracking-[-3px]">
              <span className="text-white">VT</span>
              <span className="text-[#55B8FF]">CAR</span>
            </div>
            <div className="text-[10px] tracking-[8px] text-[#B9D8F5] font-semibold mt-1">
              PREMIUM
            </div>
          </div>

          <div className="relative z-10 max-w-md">
            <div className="w-14 h-1 bg-[#55B8FF] rounded-full mb-8" />

            <h1 className="text-4xl font-bold leading-tight mb-6">
              Gestão inteligente.
              <br />
              <span className="text-[#55B8FF]">
                Grandes conquistas.
              </span>
            </h1>

            <p className="text-[#B9C9DC] text-base leading-7">
              Bem-vindo ao ambiente administrativo da VTCAR PREMIUM.
              Gerencie veículos, acompanhe oportunidades e controle
              sua operação em um só lugar.
            </p>

            <div className="mt-10 flex items-center gap-3 text-sm text-[#D6E5F5]">
              <ShieldCheck size={20} className="text-[#55B8FF]" />
              Ambiente administrativo protegido
            </div>
          </div>

          <div className="relative z-10 text-xs text-[#8EA5BF]">
            VTCAR PREMIUM © {new Date().getFullYear()} — Movemos conquistas.
          </div>
        </section>

        {/* FORMULÁRIO */}
        <section className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">
          <div className="mb-10">
            <div className="lg:hidden mb-10">
              <div className="text-4xl font-black tracking-[-3px]">
                <span className="text-[#071B35]">VT</span>
                <span className="text-[#1677D2]">CAR</span>
              </div>
              <div className="text-[10px] tracking-[8px] text-[#64748B] font-semibold mt-1">
                PREMIUM
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#EAF4FF] text-[#1267B2] text-xs font-bold mb-5">
              <LockKeyhole size={14} />
              ACESSO RESTRITO
            </div>

            <h2 className="text-3xl font-bold text-[#071B35] tracking-tight">
              Acesse sua conta
            </h2>

            <p className="text-[#64748B] mt-3 leading-6">
              Entre com suas credenciais para acessar o painel de gestão.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#10243D] mb-2"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9BB0]"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="username"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DCE5EF] bg-[#F8FAFD] text-[#10243D] outline-none transition focus:border-[#1677D2] focus:ring-4 focus:ring-[#1677D2]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#10243D] mb-2"
              >
                Senha
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9BB0]"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  autoComplete="current-password"
                  className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#DCE5EF] bg-[#F8FAFD] text-[#10243D] outline-none transition focus:border-[#1677D2] focus:ring-4 focus:ring-[#1677D2]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A9BB0] hover:text-[#1677D2]"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 flex items-center justify-center gap-3 rounded-xl bg-[#1677D2] hover:bg-[#0D5EAD] text-white font-bold shadow-lg shadow-[#1677D2]/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Verificando acesso...
                </>
              ) : (
                <>
                  Entrar no painel
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-7 border-t border-[#E8EEF5]">
            <div className="flex items-center justify-center gap-2 text-xs text-[#718096]">
              <ShieldCheck size={16} className="text-[#1677D2]" />
              Conexão protegida e acesso autorizado
            </div>

            <p className="text-center text-xs text-[#94A3B8] mt-5">
              VTCAR PREMIUM — MOVEMOS CONQUISTAS
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
