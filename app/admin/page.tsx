
import type { ElementType } from "react";
import Link from "next/link";
import {
  CarFront,
  Users,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Clock3,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";

import { getCurrentUser } from "../../lib/auth";
import { query } from "../../lib/db";

export const dynamic = "force-dynamic";

type CountResult = {
  total: string;
};

async function getCount(sql: string): Promise<number> {
  const result = await query<CountResult>(sql);
  return Number(result.rows[0]?.total ?? 0);
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[#E1E8F0] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#64748B]">
          {title}
        </span>

        <div className="rounded-xl bg-[#EAF4FF] p-3">
          <Icon size={22} className="text-[#1677D2]" />
        </div>
      </div>

      <div className="mt-5 text-3xl font-bold text-[#071B35]">
        {value.toLocaleString("pt-BR")}
      </div>

      <p className="mt-2 text-xs text-[#64748B]">
        {description}
      </p>
    </div>
  );
}

export default async function AdminPage() {
  const user = await getCurrentUser();

  const [vehicles, published, leads, newLeads] = await Promise.all([
    getCount("SELECT COUNT(*)::text AS total FROM vehicles"),
    getCount(
      "SELECT COUNT(*)::text AS total FROM vehicles WHERE status = 'published'"
    ),
    getCount("SELECT COUNT(*)::text AS total FROM leads"),
    getCount(
      "SELECT COUNT(*)::text AS total FROM leads WHERE status = 'new'"
    ),
  ]);

  const firstName =
    user?.name?.trim().split(" ")[0] || "Administrador";

  const modules = [
    {
      title: "Veículos",
      description: "Cadastre, edite e publique os veículos do estoque.",
      icon: CarFront,
      href: "/admin/veiculos",
    },
    {
      title: "Leads",
      description: "Acompanhe os contatos e oportunidades comerciais.",
      icon: Users,
    },
    {
      title: "Relatórios",
      description: "Acompanhe os indicadores e resultados da operação.",
      icon: TrendingUp,
    },
    {
      title: "Usuários",
      description: "Gerencie contas, perfis e permissões de acesso.",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#10243D]">
      <header className="border-b border-white/10 bg-[#071B35]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1677D2]">
              <LayoutDashboard size={23} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight text-white">
                VT<span className="text-[#55B8FF]">CAR</span>
              </h1>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-[#B9D8F5]">
                PREMIUM
              </p>
            </div>

            <div className="ml-3 hidden border-l border-white/20 pl-4 sm:block">
              <p className="text-sm font-semibold text-white">
                Painel administrativo
              </p>
              <p className="text-xs text-[#B9D8F5]">
                Central de gerenciamento
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-white">
              {firstName}
            </p>
            <p className="text-xs text-[#B9D8F5]">
              Área administrativa
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-9 md:px-8">
        <section className="mb-9">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#B9D8F5] bg-white px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#1677D2]" />
            <span className="text-xs font-semibold tracking-wide text-[#1677D2]">
              VISÃO GERAL DA OPERAÇÃO
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-[#071B35] md:text-4xl">
            Bem-vindo, {firstName}.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
            Acompanhe os indicadores da operação e gerencie as atividades
            da VTCAR PREMIUM em um só lugar.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Veículos cadastrados"
            value={vehicles}
            description="Total de veículos no sistema"
            icon={CarFront}
          />

          <MetricCard
            title="Anúncios publicados"
            value={published}
            description="Veículos disponíveis no catálogo"
            icon={TrendingUp}
          />

          <MetricCard
            title="Total de leads"
            value={leads}
            description="Contatos registrados no sistema"
            icon={Users}
          />

          <MetricCard
            title="Novos leads"
            value={newLeads}
            description="Contatos aguardando atendimento"
            icon={MessageSquare}
          />
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-[#E1E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#EAF4FF] p-3">
                <CarFront className="text-[#1677D2]" size={23} />
              </div>

              <div>
                <h3 className="font-bold text-[#071B35]">
                  Estoque de veículos
                </h3>
                <p className="text-xs text-[#64748B]">
                  Resumo do catálogo
                </p>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#F4F7FB] p-4">
                <p className="text-xs text-[#64748B]">
                  Total no sistema
                </p>
                <p className="mt-2 text-2xl font-bold text-[#071B35]">
                  {vehicles}
                </p>
              </div>

              <div className="rounded-xl bg-[#EAF4FF] p-4">
                <p className="text-xs text-[#64748B]">
                  Publicados
                </p>
                <p className="mt-2 text-2xl font-bold text-[#1677D2]">
                  {published}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#E1E8F0] pt-5">
              <span className="text-sm text-[#64748B]">
                Situação do banco de dados
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF8F0] px-3 py-1.5 text-xs font-semibold text-[#16834A]">
                <CheckCircle2 size={14} />
                Conectado
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E1E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#EAF4FF] p-3">
                <ShieldCheck className="text-[#1677D2]" size={23} />
              </div>

              <div>
                <h3 className="font-bold text-[#071B35]">
                  Acesso administrativo
                </h3>
                <p className="text-xs text-[#64748B]">
                  Informações da sessão atual
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              <div>
                <p className="text-xs text-[#64748B]">
                  Usuário conectado
                </p>
                <p className="mt-1 text-sm font-semibold text-[#071B35]">
                  {user?.name || "Administrador"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#64748B]">
                  E-mail
                </p>
                <p className="mt-1 break-all text-sm font-semibold text-[#071B35]">
                  {user?.email || "Não identificado"}
                </p>
              </div>

              <div className="flex items-center gap-2 border-t border-[#E1E8F0] pt-4 text-xs font-medium text-[#16834A]">
                <Clock3 size={15} />
                Sessão autenticada
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h3 className="text-xl font-bold text-[#071B35]">
              Módulos do sistema
            </h3>
            <p className="mt-1 text-sm text-[#64748B]">
              Áreas de gerenciamento da plataforma.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {modules.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#E1E8F0] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#B9D8F5] hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF]">
                  <item.icon size={23} className="text-[#1677D2]" />
                </div>

                <h4 className="mt-4 font-bold text-[#071B35]">
                  {item.title}
                </h4>

                <p className="mt-2 min-h-10 text-xs leading-5 text-[#64748B]">
                  {item.description}
                </p>

                <div className="mt-4 border-t border-[#E1E8F0] pt-4 text-xs font-medium">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center justify-between text-[#1677D2] transition hover:text-[#071B35]"
                    >
                      Gerenciar veículos
                      <ArrowUpRight size={15} />
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between text-[#64748B]">
                      Em desenvolvimento
                      <ArrowUpRight size={15} className="text-[#1677D2]" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-[#E1E8F0] py-6 text-center">
          <p className="text-xs font-semibold tracking-wide text-[#64748B]">
            VTCAR PREMIUM
          </p>
          <p className="mt-1 text-[10px] tracking-[0.2em] text-[#1677D2]">
            MOVEMOS CONQUISTAS
          </p>
        </footer>
      </div>
    </main>
  );
}
