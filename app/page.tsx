
import Link from "next/link";
import {
  Search, CarFront, Heart, SlidersHorizontal, Gauge, Fuel,
  Settings2, ArrowUpRight, ShieldCheck, Menu,
} from "lucide-react";
import { query } from "../lib/db";

export const dynamic = "force-dynamic";

type Vehicle = {
  id: string;
  title: string;
  slug: string;
  brand: string;
  model: string;
  version: string | null;
  manufacture_year: number;
  model_year: number;
  price: number | string;
  mileage: number;
  transmission: string | null;
  fuel_type: string | null;
  color: string | null;
  cover_image: string | null;
  featured: boolean;
};

type SearchParams = {
  busca?: string;
  marca?: string;
  preco?: string;
  ano?: string;
};

async function getVehicles(filters: SearchParams): Promise<Vehicle[]> {
  try {
    const values: (string | number)[] = [];
    const conditions = ["v.status = 'published'"];

    if (filters.busca?.trim()) {
      values.push(`%${filters.busca.trim()}%`);
      conditions.push(
        `(v.title ILIKE $${values.length} OR v.brand ILIKE $${values.length} OR v.model ILIKE $${values.length})`
      );
    }

    if (filters.marca?.trim()) {
      values.push(filters.marca.trim());
      conditions.push(`v.brand ILIKE $${values.length}`);
    }

    if (filters.preco && Number.isFinite(Number(filters.preco)) && Number(filters.preco) > 0) {
      values.push(Number(filters.preco));
      conditions.push(`v.price <= $${values.length}`);
    }

    if (filters.ano && Number.isInteger(Number(filters.ano))) {
      values.push(Number(filters.ano));
      conditions.push(`v.model_year >= $${values.length}`);
    }

    const result = await query<Vehicle>(
      `SELECT
        v.id, v.title, v.slug, v.brand, v.model, v.version,
        v.manufacture_year, v.model_year, v.price, v.mileage,
        v.transmission, v.fuel_type, v.color, v.featured,
        (
          SELECT vi.image_url
          FROM vehicle_images vi
          WHERE vi.vehicle_id = v.id
          ORDER BY vi.is_cover DESC, vi.position ASC
          LIMIT 1
        ) AS cover_image
      FROM vehicles v
      WHERE ${conditions.join(" AND ")}
      ORDER BY v.featured DESC, v.published_at DESC NULLS LAST
      LIMIT 32`,
      values
    );

    return result.rows;
  } catch (error) {
    console.error("Erro ao consultar veículos:", error);
    return [];
  }
}

async function getBrands(): Promise<string[]> {
  try {
    const result = await query<{ brand: string }>(
      "SELECT DISTINCT brand FROM vehicles WHERE status = 'published' ORDER BY brand ASC"
    );
    return result.rows.map((row) => row.brand);
  } catch {
    return [];
  }
}

function formatPrice(price: number | string) {
  return Number(price).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatMileage(mileage: number) {
  return `${Number(mileage).toLocaleString("pt-BR")} km`;
}

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 flex-col leading-none" aria-label="VTCAR PREMIUM">
      <span className="text-2xl font-black tracking-tight text-white">
        VT<span className="text-[#55B8FF]">CAR</span>
      </span>
      <span className="mt-1 text-[9px] font-bold tracking-[0.36em] text-[#B9D8F5]">
        PREMIUM
      </span>
    </Link>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = await searchParams;
  const [vehicles, brands] = await Promise.all([
    getVehicles(filters),
    getBrands(),
  ]);

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#10243D]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071B35] shadow-md">
        <div className="mx-auto flex min-h-[76px] max-w-[1500px] items-center justify-between gap-5 px-5 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-6 text-xs font-semibold text-white/80 xl:flex">
            <Link href="/" className="text-[#55B8FF]">Início</Link>
            <Link href="#estoque" className="transition hover:text-[#55B8FF]">Estoque</Link>
            <Link href="#avaliacao" className="transition hover:text-[#55B8FF]">Avaliação</Link>
            <Link href="#financiamento" className="transition hover:text-[#55B8FF]">Financiamento</Link>
            <Link href="#credito" className="transition hover:text-[#55B8FF]">Aprove seu crédito</Link>
            <Link href="#empresa" className="transition hover:text-[#55B8FF]">Empresa</Link>
            <Link href="#contato" className="transition hover:text-[#55B8FF]">Contato</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="#estoque"
              className="hidden rounded-lg border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition hover:border-[#55B8FF] sm:block"
            >
              Ver estoque
            </Link>
            <Link
              href="#contato"
              className="rounded-lg bg-[#1677D2] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#0D5EAD]"
            >
              Fale conosco
            </Link>
            <Menu className="text-white xl:hidden" size={22} />
          </div>
        </div>
      </header>

      <section className="border-b border-[#DCE6F0] bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-10 lg:px-8">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1677D2]">
                VTCAR PREMIUM · ESTOQUE
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-[#071B35] sm:text-5xl">
                Encontre o veículo ideal para sua próxima conquista.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#64748B]">
                Explore nosso catálogo, compare opções e encontre seu próximo carro.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#E1E8F0] bg-[#F4F7FB] p-4">
              <ShieldCheck size={27} className="text-[#1677D2]" />
              <div>
                <p className="text-sm font-bold text-[#071B35]">VTCAR PREMIUM</p>
                <p className="text-xs text-[#64748B]">Uma experiência automotiva</p>
              </div>
            </div>
          </div>

          <form action="/" method="GET" className="mt-8 grid gap-3 rounded-2xl border border-[#E1E8F0] bg-[#F4F7FB] p-3 sm:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4">
              <Search size={20} className="shrink-0 text-[#1677D2]" />
              <input
                name="busca"
                defaultValue={filters.busca || ""}
                placeholder="Busque por marca, modelo ou veículo..."
                className="h-12 w-full bg-transparent text-sm text-[#071B35] outline-none placeholder:text-[#94A3B8]"
              />
            </div>
            <button type="submit" className="rounded-xl bg-[#1677D2] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#0D5EAD]">
              Buscar veículos
            </button>
          </form>
        </div>
      </section>

      <section id="estoque" className="mx-auto max-w-[1500px] scroll-mt-24 px-5 py-9 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#071B35] sm:text-2xl">Estoque de veículos</h2>
            <p className="mt-1 text-xs text-[#64748B]">Encontre seu próximo veículo na VTCAR PREMIUM.</p>
          </div>
          <span className="rounded-full border border-[#B9D8F5] bg-white px-4 py-2 text-xs font-bold text-[#123B68]">
            {vehicles.length} {vehicles.length === 1 ? "veículo encontrado" : "veículos encontrados"}
          </span>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[245px_1fr]">
          <aside className="rounded-2xl border border-[#E1E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E1E8F0] pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#1677D2]" />
                <h3 className="font-bold text-[#071B35]">Filtrar resultados</h3>
              </div>
              <Link href="#estoque" className="text-[10px] font-semibold text-[#1677D2]">Limpar</Link>
            </div>

            <form action="/" method="GET" className="space-y-5 pt-5">
              <div>
                <label className="mb-2 block text-xs font-bold text-[#123B68]">Marca</label>
                <select name="marca" defaultValue={filters.marca || ""} className="h-11 w-full rounded-lg border border-[#DCE6F0] bg-white px-3 text-xs text-[#10243D] outline-none focus:border-[#1677D2]">
                  <option value="">Todas as marcas</option>
                  {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-[#123B68]">Buscar modelo</label>
                <input name="busca" defaultValue={filters.busca || ""} placeholder="Ex.: Corolla, Onix..." className="h-11 w-full rounded-lg border border-[#DCE6F0] px-3 text-xs outline-none focus:border-[#1677D2]" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-[#123B68]">Preço máximo</label>
                <select name="preco" defaultValue={filters.preco || ""} className="h-11 w-full rounded-lg border border-[#DCE6F0] bg-white px-3 text-xs outline-none focus:border-[#1677D2]">
                  <option value="">Qualquer valor</option>
                  <option value="30000">Até R$ 30 mil</option>
                  <option value="50000">Até R$ 50 mil</option>
                  <option value="70000">Até R$ 70 mil</option>
                  <option value="100000">Até R$ 100 mil</option>
                  <option value="150000">Até R$ 150 mil</option>
                  <option value="200000">Até R$ 200 mil</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-[#123B68]">Ano a partir de</label>
                <select name="ano" defaultValue={filters.ano || ""} className="h-11 w-full rounded-lg border border-[#DCE6F0] bg-white px-3 text-xs outline-none focus:border-[#1677D2]">
                  <option value="">Todos os anos</option>
                  <option value="2025">2025</option>
                  <option value="2023">2023</option>
                  <option value="2020">2020</option>
                  <option value="2018">2018</option>
                  <option value="2015">2015</option>
                  <option value="2010">2010</option>
                </select>
              </div>

              <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1677D2] text-xs font-bold text-white transition hover:bg-[#0D5EAD]">
                <SlidersHorizontal size={15} />
                Aplicar filtros
              </button>
            </form>

            <div className="mt-6 rounded-xl bg-[#F4F7FB] p-4">
              <p className="text-xs font-bold text-[#123B68]">Precisa de ajuda?</p>
              <p className="mt-2 text-[11px] leading-5 text-[#64748B]">Nossa equipe pode ajudar você a encontrar o veículo ideal.</p>
              <Link href="#contato" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#1677D2]">
                Falar com a equipe <ArrowUpRight size={14} />
              </Link>
            </div>
          </aside>

          <div>
            {vehicles.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {vehicles.map((vehicle) => (
                  <article key={vehicle.id} className="group overflow-hidden rounded-2xl border border-[#E1E8F0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#EAF0F6]">
                      <Link
                        href={`/veiculos/${encodeURIComponent(vehicle.slug)}`}
                        aria-label={`Ver detalhes de ${vehicle.title}`}
                        className="block h-full w-full"
                      >
                        {vehicle.cover_image ? (
                          <img
                            src={vehicle.cover_image}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <CarFront size={72} strokeWidth={1} className="text-[#9CB1C7]" />
                          </div>
                        )}
                      </Link>

                      {vehicle.featured && (
                        <span className="absolute left-3 top-3 rounded-md bg-[#1677D2] px-3 py-1.5 text-[10px] font-bold text-white">
                          DESTAQUE
                        </span>
                      )}

                      <button type="button" aria-label="Adicionar aos favoritos" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#123B68] shadow-sm">
                        <Heart size={17} />
                      </button>
                    </div>

                    <div className="p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#1677D2]">{vehicle.brand}</p>

                      <Link href={`/veiculos/${encodeURIComponent(vehicle.slug)}`} className="group/title block">
                        <h3 className="mt-1 line-clamp-1 text-lg font-black text-[#071B35] transition group-hover/title:text-[#1677D2]">
                          {vehicle.model}
                        </h3>
                      </Link>

                      {vehicle.version && (
                        <p className="mt-1 line-clamp-1 text-xs text-[#64748B]">{vehicle.version}</p>
                      )}

                      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-y border-[#E8EDF3] py-4 text-[11px] text-[#64748B]">
                        <span className="flex items-center gap-2"><Gauge size={14} className="text-[#1677D2]" />{formatMileage(vehicle.mileage)}</span>
                        <span className="flex items-center gap-2"><Settings2 size={14} className="text-[#1677D2]" />{vehicle.transmission || "Consulte"}</span>
                        <span className="flex items-center gap-2"><Fuel size={14} className="text-[#1677D2]" />{vehicle.fuel_type || "Consulte"}</span>
                        <span className="flex items-center gap-2"><CarFront size={14} className="text-[#1677D2]" />{vehicle.manufacture_year}/{vehicle.model_year}</span>
                      </div>

                      <div className="mt-4 flex items-end justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-medium text-[#8293A7]">PREÇO</p>
                          <p className="mt-1 text-xl font-black text-[#123B68]">{formatPrice(vehicle.price)}</p>
                        </div>

                        <Link
                          href={`/veiculos/${encodeURIComponent(vehicle.slug)}`}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#071B35] px-3 text-[10px] font-bold text-white transition hover:bg-[#1677D2]"
                        >
                          Ver detalhes <ArrowUpRight size={15} />
                        </Link>
                      </div>

                      <Link
                        href={`mailto:atendimento.vtcar@gmail.com?subject=${encodeURIComponent(`Tenho interesse no veículo ${vehicle.title}`)}`}
                        className="mt-3 flex h-10 w-full items-center justify-center rounded-lg border border-[#B9D8F5] text-xs font-bold text-[#123B68] transition hover:bg-[#EAF0F6]"
                      >
                        Tenho interesse neste veículo
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#E1E8F0] bg-white px-6 py-20 text-center">
                <CarFront size={55} className="mx-auto text-[#1677D2]" />
                <h3 className="mt-5 text-xl font-black text-[#071B35]">Nenhum veículo encontrado.</h3>
                <p className="mt-2 text-sm text-[#64748B]">Experimente alterar os filtros ou consultar nossa equipe.</p>
                <Link href="/" className="mt-5 inline-flex rounded-lg bg-[#1677D2] px-5 py-3 text-xs font-bold text-white">Limpar pesquisa</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="avaliacao" className="scroll-mt-24 border-y border-[#E1E8F0] bg-white py-16">
        <div className="mx-auto grid max-w-[1500px] gap-6 px-5 md:grid-cols-3 lg:px-8">
          {[
            ["Avaliação de veículos", "Quer negociar seu usado? Converse com nossa equipe."],
            ["Financiamento", "Consulte condições para realizar sua próxima conquista."],
            ["Aprove seu crédito", "Entre em contato para conhecer as possibilidades."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-[#E1E8F0] bg-[#F4F7FB] p-6">
              <h3 className="font-bold text-[#071B35]">{title}</h3>
              <p className="mt-2 text-xs leading-6 text-[#64748B]">{description}</p>
              <Link href="#contato" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#1677D2]">
                Saiba mais <ArrowUpRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="empresa" className="scroll-mt-24 bg-[#071B35] py-16 text-white">
        <div className="mx-auto max-w-[1500px] px-5 lg:px-8">
          <p className="text-xs font-bold tracking-[0.2em] text-[#55B8FF]">VTCAR PREMIUM</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-black sm:text-4xl">Movemos você em direção às suas conquistas.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
            Uma experiência automotiva moderna, com atendimento próximo e compromisso com cada negociação.
          </p>
        </div>
      </section>

      <section id="contato" className="scroll-mt-24 bg-[#EAF0F6] px-5 py-14 lg:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-6 rounded-2xl bg-white p-7 shadow-sm md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black text-[#071B35]">Vamos encontrar seu próximo veículo?</h2>
            <p className="mt-2 text-sm text-[#64748B]">Entre em contato com a equipe VTCAR PREMIUM.</p>
          </div>
          <a href="mailto:atendimento.vtcar@gmail.com?subject=Atendimento%20VTCAR%20PREMIUM" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1677D2] px-6 py-4 text-xs font-bold text-white hover:bg-[#0D5EAD]">
            Falar com a equipe <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <footer className="bg-[#071B35] px-5 py-8 text-center text-xs text-white/55">
        <p className="font-bold tracking-widest text-white">VTCAR PREMIUM</p>
        <p className="mt-2 text-[10px] tracking-[0.2em] text-[#B9D8F5]">MOVEMOS CONQUISTAS</p>
        <p className="mt-4">© {new Date().getFullYear()} VTCAR PREMIUM. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
