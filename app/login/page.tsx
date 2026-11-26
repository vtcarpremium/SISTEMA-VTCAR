
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Não foi possível entrar.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError(
        "Erro de conexão. Verifique sua internet e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090909] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <a href="/" className="inline-block">
            <img
              src="/logo.svg"
              alt="VTCAR PREMIUM"
              className="mx-auto h-auto w-64 max-w-full"
            />
          </a>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.35em] text-[#C6A15B]">
            Área administrativa
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Bem-vindo de volta
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Entre com suas credenciais para continuar.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-white/10 bg-[#141414] p-7 shadow-2xl sm:p-9"
        >
          <div className="mb-6">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-xl border border-white/10 bg-[#090909] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#FF6B00]"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Senha
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
              className="w-full rounded-xl border border-white/10 bg-[#090909] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#FF6B00]"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#FF6B00] px-5 py-4 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#ff8126] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verificando acesso..." : "Entrar no painel"}
          </button>

          <p className="mt-6 text-center text-xs leading-relaxed text-gray-500">
            Acesso restrito a usuários autorizados.
            <br />
            VTCAR PREMIUM — WE BUILD MOMENTUM.
          </p>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm text-gray-500 transition hover:text-[#FF6B00]"
          >
            Voltar ao site
          </a>
        </div>
      </div>
    </main>
  );
}
