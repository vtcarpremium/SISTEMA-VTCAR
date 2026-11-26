
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CarFront,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Star,
  MessageCircle,
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
  cover_image: string | null;
  featured: boolean;
};

async function getVehicles(): Promise<Vehicle[]> {
  try {
    const result = await query<Vehicle>(
      `SELECT
        v.id,
        v.title,
        v.slug,
        v.brand,
        v.model,
        v.version,
        v.manufacture_year,
        v.model_year,
        v.price,
        v.mileage,
        v.transmission,
        v.fuel_type,
        v.featured,
        (
          SELECT vi.image_url
          FROM vehicle_images vi
          WHERE vi.vehicle_id = v.id
          ORDER BY vi.is_cover DESC, vi.position ASC
          LIMIT 1
        ) AS cover_image
      FROM vehicles v
      WHERE v.status = 'published'
      ORDER BY v.featured DESC, v.published_at DESC NULLS LAST
      LIMIT 6`
    );

    return result.rows;
  } catch (error) {
    console.error("Erro ao carregar catálogo:", error);
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
    <Link href="/" aria-label="VTCAR PREMIUM - Início">
      <Image
        src="/logo.svg"
        alt="VTCAR PREMIUM"
        width={230}
        height={76}
        priority
        className="h-auto w-[155px] sm:w-[190px]"
      />
    </Link>
  );
}

export default async function Home() {
  const vehicles = await getVehicles();

  return (
    <main className="min-h-screen bg-[#F7F7F5] text-[#171717]">
      {/* CABEÇALHO */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090909] shadow-lg">
        <div className="mx-auto flex min-h-[82px] max-w-[1320px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
          <Logo />

          <nav className="hidden items-center gap-8 text-sm font-medium text-white/75 lg:flex">
            <Link href="/" className="text-[#FF6B00]">Início</Link>
            <Link href="#estoque" className="transition hover:text-[#FF6B00]">Estoque</Link>
            <Link href="#diferenciais" className="transition hover:text-[#FF6B00]">Por que escolher</Link>
            <Link href="#sobre" className="transition hover:text-[#FF6B00]">Sobre nós</Link>
            <Link href="#contato" className="transition hover:text-[#FF6B00]">Contato</Link>
          </nav>

          <Link
            href="#contato"
            className="inline-flex items-center gap-2 rounded-lg bg-[#FF6B00] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#D95700] sm:px-6"
          >
            Fale conosco
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </header>

      {/* BANNER PRINCIPAL */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#FF6B00]/[0.07] blur-[100px]" />

        <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/20 bg-[#FF6B00]/[0.06] px-4 py-2">
              <Star size={14} className="fill-[#FF6B00] text-[#FF6B00]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D95700]">
                VTCAR PREMIUM
              </span>
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-[68px]">
              Seu próximo carro.
              <br />
              <span className="text-[#FF6B00]">Sua próxima conquista.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#666] sm:text-lg">
              Encontre seu próximo veículo com uma experiência de compra
              diferenciada. Conheça a seleção VTCAR PREMIUM e conte com
              atendimento personalizado em cada etapa.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#estoque"
                className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-lg bg-[#FF6B00] px-7 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-1 hover:bg-[#D95700]"
              >
                Explorar veículos
                <ArrowRight size={18} />
              </Link>

              <Link
                href="#contato"
                className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-lg border border-[#DDD] bg-white px-7 text-sm font-bold text-[#222] transition hover:border-[#FF6B00] hover:text-[#D95700]"
              >
                Falar com consultor
                <MessageCircle size={18} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 text-sm text-[#666]">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#FF6B00]" />
                Atendimento personalizado
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#FF6B00]" />
                Transparência
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-8 rounded-full bg-[#FF6B00]/10 blur-[90px]" />

            <div className="relative overflow-hidden rounded-3xl border border-[#E9E9E9] bg-[#111] p-7 text-white shadow-2xl sm:p-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.25em] text-[#C6A15B]">
                    VTCAR PREMIUM
                  </p>
                  <p className="mt-2 text-[10px] tracking-[0.18em] text-white/50">
                    MOVEMOS CONQUISTAS
                  </p>
                </div>
                <CarFront size={30} className="text-[#FF6B00]" />
              </div>

              <div className="my-10 flex min-h-[210px] items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#252525] to-[#090909]">
                <div className="text-center">
                  <CarFront
                    size={110}
                    strokeWidth={1}
                    className="mx-auto text-[#FF6B00]"
                  />
                  <p className="mt-4 text-xs font-bold tracking-[0.25em] text-white/60">
                    EXPERIÊNCIA AUTOMOTIVA
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Nosso compromisso
                  </p>
                  <p className="mt-2 text-xl font-black">
                    Qualidade e confiança.
                  </p>
                </div>
                <span className="rounded-full border border-[#C6A15B]/40 px-3 py-2 text-[9px] font-bold tracking-widest text-[#C6A15B]">
                  PREMIUM
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAIXA DE DIFERENCIAIS */}
      <section className="border-y border-[#EAEAEA] bg-white">
        <div className="mx-auto grid max-w-[1320px] divide-y divide-[#EAEAEA] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
          {[
            ["01", "Atendimento próximo", "Atenção às suas necessidades."],
            ["02", "Negociação transparente", "Informações claras em cada etapa."],
            ["03", "Experiência premium", "Uma escolha feita com tranquilidade."],
          ].map(([number, title, description]) => (
            <div key={number} className="flex items-center gap-5 py-7 sm:px-6">
              <span className="text-3xl font-black text-[#FF6B00]">{number}</span>
              <div>
                <h2 className="text-sm font-bold">{title}</h2>
                <p className="mt-1 text-xs text-[#777]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATÁLOGO */}
      <section id="estoque" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D95700]">
                Seleção especial
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                Encontre seu próximo veículo.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#777]">
                Confira os veículos disponíveis no catálogo VTCAR PREMIUM.
              </p>
            </div>

            <span className="text-sm font-semibold text-[#777]">
              {vehicles.length} {vehicles.length === 1 ? "veículo disponível" : "veículos disponíveis"}
            </span>
          </div>

          {vehicles.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <article
                  key={vehicle.id}
                  className="group overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[#ECECEB]">
                    {vehicle.cover_image ? (
                      <img
                        src={vehicle.cover_image}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <CarFront size={70} strokeWidth={1} className="text-[#B7B7B7]" />
                    )}

                    {vehicle.featured && (
                      <span className="absolute left-4 top-4 rounded-full bg-[#FF6B00] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        Destaque
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#999]">
                      {vehicle.brand}
                    </p>

                    <h3 className="mt-2 text-xl font-extrabold">
                      {vehicle.model}
                    </h3>

                    {vehicle.version && (
                      <p className="mt-1 text-sm text-[#777]">{vehicle.version}</p>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-3 border-y border-[#EEE] py-4 text-xs text-[#777]">
                      <span>{vehicle.manufacture_year}/{vehicle.model_year}</span>
                      <span>{formatMileage(vehicle.mileage)}</span>
                      <span>{vehicle.transmission || "Consulte câmbio"}</span>
                      <span>{vehicle.fuel_type || "Consulte combustível"}</span>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#999]">
                          Valor anunciado
                        </p>
                        <p className="mt-1 text-xl font-black text-[#D95700]">
                          {formatPrice(vehicle.price)}
                        </p>
                      </div>

                      <Link
                        href={`mailto:atendimento.vtcar@gmail.com?subject=${encodeURIComponent(`Interesse no veículo ${vehicle.title}`)}`}
                        className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#111] text-white transition hover:bg-[#FF6B00]"
                        aria-label={`Consultar ${vehicle.title}`}
                      >
                        <ArrowUpRight size={20} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-[#E8E8E8] bg-white px-6 py-16 text-center shadow-sm">
              <CarFront size={54} className="mx-auto text-[#FF6B00]" />
              <h3 className="mt-5 text-2xl font-black">
                Nosso catálogo está sendo preparado.
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#777]">
                Em breve você poderá conferir nossos veículos disponíveis.
                Entre em contato com a equipe para consultar oportunidades.
              </p>
              <Link
                href="#contato"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#FF6B00] px-6 py-3 text-sm font-bold text-white hover:bg-[#D95700]"
              >
                Falar com a equipe
                <ArrowRight size={17} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section id="diferenciais" className="scroll-mt-24 bg-[#111] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B00]">
            O padrão VTCAR
          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-black sm:text-5xl">
            Comprar bem começa com uma boa experiência.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Confiança",
                description: "Informações claras e respeito em cada negociação.",
              },
              {
                icon: Star,
                title: "Qualidade",
                description: "Uma experiência de compra pensada nos detalhes.",
              },
              {
                icon: MessageCircle,
                title: "Atendimento",
                description: "Acompanhamento próximo para ajudar na sua escolha.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
                <Icon size={32} className="text-[#FF6B00]" />
                <h3 className="mt-6 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 sm:px-8 md:grid-cols-2 md:items-center lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D95700]">
              Sobre a VTCAR
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              Movemos você em direção às suas conquistas.
            </h2>
          </div>

          <div className="border-l-2 border-[#FF6B00] pl-7">
            <p className="text-base leading-8 text-[#666]">
              A VTCAR PREMIUM acredita que cada veículo representa novos
              caminhos, objetivos e conquistas.
            </p>
            <p className="mt-5 text-base leading-8 text-[#666]">
              Nosso compromisso é oferecer uma experiência automotiva moderna,
              transparente e personalizada, colocando o cliente no centro de
              cada negociação.
            </p>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="scroll-mt-24 bg-[#F1F1EF] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-8 rounded-3xl bg-[#111] p-8 text-white sm:p-14 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C6A15B]">
              Atendimento VTCAR PREMIUM
            </p>
            <h2 className="mt-4 text-3xl font-black sm:text-5xl">
              Sua próxima conquista começa com uma conversa.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/60">
              Entre em contato com nossa equipe e descubra as oportunidades disponíveis.
            </p>
          </div>

          <a
            href="mailto:atendimento.vtcar@gmail.com?subject=Atendimento%20VTCAR%20PREMIUM"
            className="inline-flex min-h-[56px] shrink-0 items-center justify-center gap-3 rounded-lg bg-[#FF6B00] px-7 text-sm font-bold text-white transition hover:bg-[#D95700]"
          >
            Falar com a equipe
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="bg-[#090909] text-white">
        <div className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Logo />
              <p className="mt-4 max-w-sm text-xs leading-6 text-white/45">
                Uma experiência automotiva construída sobre confiança, qualidade e compromisso.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-white/60">
              <Link href="#estoque" className="hover:text-[#FF6B00]">Estoque</Link>
              <Link href="#diferenciais" className="hover:text-[#FF6B00]">Diferenciais</Link>
              <Link href="#sobre" className="hover:text-[#FF6B00]">Sobre nós</Link>
              <Link href="#contato" className="hover:text-[#FF6B00]">Contato</Link>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-7 text-[10px] tracking-wider text-white/40 sm:flex-row">
            <p>© {new Date().getFullYear()} VTCAR PREMIUM. TODOS OS DIREITOS RESERVADOS.</p>
            <p className="font-bold tracking-[0.2em] text-[#C6A15B]">
              WE BUILD MOMENTUM.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
