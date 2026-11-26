
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
} from "lucide-react";
import { getCurrentUser } from "../../lib/auth";
import { query } from "../../lib/db";

export const dynamic = "force-dynamic";

type CountResult = {
  total: string;
} & Record<string, unknown>;

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
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 transition hover:border-[#FF6B00]/40">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{title}</span>
        <div className="rounded-xl bg-[#FF6B00]/10 p-3">
          <Icon size={21} className="text-[#FF6B00]" />
        </div>
      </div>

      <div className="mt-5 text-3xl font-bold text-white">
        {value.toLocaleString("pt-BR")}
      </div>

      <p className="mt-2 text-xs text-gray-500">{description}</p>
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

  const firstName = user?.name?.trim().split(" ")[0] || "Administrador";

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <header className="border-b border-white/10 bg-[#101010]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6B00]">
              <LayoutDashboard size={23} className="text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wide">
                VTCAR <span className="text-[#FF6B00]">PREMIUM</span>
              </h1>
              <p className="text-xs text-gray-500">Painel administrativo</p>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">{firstName}</p>
            <p className="text-xs text-gray-500">Área administrativa</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-9 md:px-8">
        <section className="mb-9">
          <p className="mb-2 text-sm font-medium text-[#FF6B00]">
            VISÃO GERAL
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Bem-vindo, {firstName}.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            Acompanhe os indicadores da operação e gerencie as atividades da
            VTCAR PREMIUM em um só lugar.
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

        <section className="mt-9 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-[#141414] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#FF6B00]/10 p-3">
                <CarFront className="text-[#FF6B00]" size={22} />
              </div>

              <div>
                <h3 className="font-semibold">Estoque de veículos</h3>
                <p className="text-xs text-gray-500">
                  Resumo do catálogo
                </p>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-black/30 p-4">
                <p className="text-xs text-gray-500">Total no sistema</p>
                <p className="mt-2 text-2xl font-bold">{vehicles}</p>
              </div>

              <div className="rounded-xl bg-black/30 p-4">
                <p className="text-xs text-gray-500">Publicados</p>
                <p className="mt-2 text-2xl font-bold text-[#FF6B00]">
                  {published}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
              <span className="text-sm text-gray-400">
                Situação do catálogo
              </span>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                Banco conectado
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#141414] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#FF6B00]/10 p-3">
                <ShieldCheck className="text-[#FF6B00]" size={22} />
              </div>

              <div>
                <h3 className="font-semibold">Acesso administrativo</h3>
                <p className="text-xs text-gray-500">
                  Sessão atual
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              <div>
                <p className="text-xs text-gray-500">Usuário conectado</p>
                <p className="mt-1 text-sm font-medium">
                  {user?.name || "Administrador"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">E-mail</p>
                <p className="mt-1 break-all text-sm font-medium">
                  {user?.email || "Não identificado"}
                </p>
              </div>

              <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-green-400">
                <Clock3 size={15} />
                Sessão autenticada
              </div>
            </div>
          </div>
        </section>

        <section className="mt-9">
          <div className="mb-5">
            <h3 className="text-xl font-bold">Módulos do sistema</h3>
            <p className="mt-1 text-sm text-gray-500">
              Estrutura de gerenciamento da plataforma.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Veículos",
                description: "Cadastro, edição e publicação do estoque.",
                icon: CarFront,
              },
              {
                title: "Leads",
                description: "Acompanhamento dos interessados.",
                icon: Users,
              },
              {
                title: "Relatórios",
                description: "Indicadores e desempenho comercial.",
                icon: TrendingUp,
              },
              {
                title: "Usuários",
                description: "Contas, perfis e permissões de acesso.",
                icon: ShieldCheck,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-[#141414] p-5"
              >
                <item.icon size={23} className="text-[#FF6B00]" />

                <h4 className="mt-4 font-semibold">{item.title}</h4>

                <p className="mt-2 min-h-10 text-xs leading-5 text-gray-500">
                  {item.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
                  Em desenvolvimento
                  <ArrowUpRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-white/10 py-6 text-center text-xs text-gray-600">
          VTCAR PREMIUM · WE BUILD MOMENTUM
        </footer>
      </div>
    </main>
  );
}
