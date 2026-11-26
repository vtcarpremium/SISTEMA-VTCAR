
import Image from "next/image";

import {
  ArrowRight,
  ArrowUpRight,
  CarFront,
  CheckCircle2,
  ChevronRight,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Negociação transparente",
    description:
      "Informações claras e atendimento responsável para você comprar com tranquilidade.",
    number: "01",
  },
  {
    icon: Sparkles,
    title: "Experiência premium",
    description:
      "Uma experiência diferenciada, com atenção aos detalhes em cada etapa.",
    number: "02",
  },
  {
    icon: Wallet,
    title: "Condições facilitadas",
    description:
      "Atendimento personalizado para encontrar possibilidades alinhadas ao seu momento.",
    number: "03",
  },
];

function BrandLogo() {
  return (
    <a
      href="/"
      aria-label="VTCAR PREMIUM - Página inicial"
      className="group inline-flex items-center"
    >
      <Image
        src="/logo.svg"
        alt="VTCAR PREMIUM — Movemos Conquistas"
        width={250}
        height={83}
        priority
        className="h-auto w-[175px] transition duration-300 group-hover:scale-[1.03] sm:w-[215px]"
      />
    </a>
  );
}

function DecorativeCar() {
  return (
    <svg
      viewBox="0 0 720 430"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-label="Ilustração abstrata de um automóvel esportivo"
      role="img"
    >
      <defs>
        <linearGradient id="carLine" x1="100" y1="120" x2="630" y2="350">
          <stop stopColor="#FF6B00" />
          <stop offset="1" stopColor="#C6A15B" />
        </linearGradient>
        <linearGradient id="carGlow" x1="350" y1="180" x2="350" y2="370">
          <stop stopColor="#FF6B00" stopOpacity=".22" />
          <stop offset="1" stopColor="#FF6B00" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="365" cy="330" rx="285" ry="75" fill="url(#carGlow)" />

      <path
        d="M75 282L118 263L165 248L216 188C231 171 250 160 271 155L390 128C417 122 445 129 466 147L551 222L615 242C635 249 650 267 650 288V310H592C585 275 557 251 523 251C489 251 461 275 454 310H257C250 275 222 251 188 251C154 251 126 275 119 310H75V282Z"
        stroke="url(#carLine)"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      <path
        d="M238 181L278 161L386 139C408 135 429 141 446 155L512 215H207L238 181Z"
        stroke="#C6A15B"
        strokeOpacity=".75"
        strokeWidth="2"
      />

      <path
        d="M363 141L351 215M451 157L435 215"
        stroke="#C6A15B"
        strokeOpacity=".55"
        strokeWidth="2"
      />

      <path
        d="M84 280L152 267M565 234L620 255"
        stroke="#FF6B00"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <circle cx="188" cy="310" r="38" fill="#090909" stroke="#C6A15B" strokeWidth="3" />
      <circle cx="188" cy="310" r="22" stroke="#FF6B00" strokeWidth="3" />
      <circle cx="188" cy="310" r="7" fill="#C6A15B" />

      <circle cx="523" cy="310" r="38" fill="#090909" stroke="#C6A15B" strokeWidth="3" />
      <circle cx="523" cy="310" r="22" stroke="#FF6B00" strokeWidth="3" />
      <circle cx="523" cy="310" r="7" fill="#C6A15B" />

      <path d="M78 347H640" stroke="#FF6B00" strokeOpacity=".3" strokeWidth="1" />
      <path d="M145 367H575" stroke="#C6A15B" strokeOpacity=".2" strokeWidth="1" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#090909] text-white selection:bg-[#FF6B00] selection:text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#090909]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[82px] max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-12">

          <BrandLogo />

          <nav className="hidden items-center gap-9 text-[13px] font-medium text-[#A1A1AA] lg:flex">
            <a href="#" className="transition hover:text-[#FF6B00]">
              Início
            </a>
            <a href="#estoque" className="transition hover:text-[#FF6B00]">
              Estoque
            </a>
            <a href="#diferenciais" className="transition hover:text-[#FF6B00]">
              Diferenciais
            </a>
            <a href="#sobre" className="transition hover:text-[#FF6B00]">
              Sobre nós
            </a>
            <a href="#contato" className="transition hover:text-[#FF6B00]">
              Contato
            </a>
          </nav>

          <a
            href="#contato"
            className="hidden items-center gap-2 rounded-lg bg-[#FF6B00] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#D95700] sm:inline-flex"
          >
            Fale conosco
            <ArrowUpRight size={15} />
          </a>

          <a
            href="#contato"
            className="rounded-lg border border-white/10 p-2.5 text-white lg:hidden"
            aria-label="Ir para contato"
          >
            <Menu size={21} />
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative border-b border-white/[0.06]">
        <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[#FF6B00]/[0.07] blur-[130px]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[300px] w-[300px] rounded-full bg-[#C6A15B]/[0.04] blur-[120px]" />

        <div className="relative mx-auto grid min-h-[650px] max-w-[1320px] items-center gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-12 lg:py-24">

          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#C6A15B]/25 bg-[#C6A15B]/[0.06] px-4 py-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C6A15B]">
                Excelência em cada escolha
              </span>
            </div>

            <h1 className="max-w-2xl text-[43px] font-black leading-[1.06] tracking-[-0.045em] sm:text-6xl lg:text-[70px]">
              Sua próxima conquista começa{" "}
              <span className="text-[#FF6B00]">aqui.</span>
            </h1>

            <p className="mt-7 max-w-[510px] text-[15px] leading-8 text-[#A1A1AA] sm:text-base">
              Mais do que encontrar um automóvel, queremos proporcionar uma
              experiência de compra diferenciada. Conheça a VTCAR PREMIUM.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#estoque"
                className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-lg bg-[#FF6B00] px-7 text-xs font-extrabold uppercase tracking-wider text-white transition hover:-translate-y-0.5 hover:bg-[#D95700]"
              >
                Conheça nosso estoque
                <ArrowRight size={17} />
              </a>

              <a
                href="#contato"
                className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-lg border border-white/15 px-7 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#C6A15B]/60 hover:text-[#C6A15B]"
              >
                Entre em contato
                <MessageCircle size={17} />
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-4 border-t border-white/[0.08] pt-7">
              <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                <CheckCircle2 size={16} className="text-[#FF6B00]" />
                Atendimento personalizado
              </div>

              <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                <CheckCircle2 size={16} className="text-[#FF6B00]" />
                Transparência na negociação
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[650px]">
            <div className="absolute inset-10 rounded-full bg-[#FF6B00]/10 blur-[100px]" />

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1B1A18] via-[#121212] to-[#090909] p-5 sm:p-9">

              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.24em] text-[#C6A15B]">
                    VTCAR PREMIUM
                  </p>
                  <p className="mt-1 text-[9px] tracking-[0.16em] text-[#777]">
                    AUTOMOTIVE EXPERIENCE
                  </p>
                </div>

                <div className="rounded-full border border-[#C6A15B]/30 px-3 py-1.5 text-[9px] font-bold tracking-[0.16em] text-[#C6A15B]">
                  EXCLUSIVIDADE
                </div>
              </div>

              <div className="relative my-6 aspect-[1.5/1]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-48 w-48 rounded-full border border-[#FF6B00]/10 sm:h-64 sm:w-64" />
                  <div className="absolute h-36 w-36 rounded-full border border-[#C6A15B]/10 sm:h-52 sm:w-52" />
                </div>

                <div className="relative h-full w-full">
                  <DecorativeCar />
                </div>
              </div>

              <div className="flex items-end justify-between border-t border-white/10 pt-5">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] text-[#777]">
                    NOSSO PROPÓSITO
                  </p>
                  <p className="mt-2 text-lg font-black tracking-tight text-white sm:text-xl">
                    MOVEMOS CONQUISTAS.
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[9px] tracking-widest text-[#777]">
                    DESDE O PRIMEIRO CONTATO
                  </p>
                  <p className="mt-2 text-xs font-bold text-[#C6A15B]">
                    VTCAR / PREMIUM
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-2xl border border-[#FF6B00]/20" />
          </div>
        </div>
      </section>

      {/* FAIXA INSTITUCIONAL */}
      <section className="border-b border-white/[0.07] bg-[#101010]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 divide-y divide-white/[0.07] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
          {[
            ["01", "Qualidade", "Compromisso com cada detalhe."],
            ["02", "Confiança", "Relacionamentos construídos com transparência."],
            ["03", "Experiência", "Atendimento que valoriza sua escolha."],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="flex items-center gap-5 py-7 sm:px-6 lg:px-9"
            >
              <span className="text-2xl font-black text-[#FF6B00]">
                {number}
              </span>

              <div>
                <p className="text-sm font-bold text-white">{title}</p>
                <p className="mt-1 text-xs text-[#888]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ESTOQUE */}
      <section id="estoque" className="scroll-mt-24 py-24 sm:py-28">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#FF6B00]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FF6B00]">
                  Seleção VTCAR
                </p>
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                Nosso estoque<span className="text-[#FF6B00]">.</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#888]">
                Encontre o veículo que combina com seu estilo, suas necessidades e suas próximas conquistas.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#C6A15B]">
              CATÁLOGO VTCAR PREMIUM
              <ChevronRight size={15} />
            </span>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
            <div className="grid items-center gap-8 p-7 sm:p-12 lg:grid-cols-[auto_1fr] lg:gap-14">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-[#FF6B00]/20 bg-[#FF6B00]/[0.06] text-[#FF6B00]">
                <CarFront size={48} strokeWidth={1.3} />
              </div>

              <div className="text-center lg:text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C6A15B]">
                  Novidades em breve
                </p>

                <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                  Estamos preparando nosso catálogo.
                </h3>

                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#888] lg:mx-0">
                  Nosso estoque será atualizado com veículos cadastrados e informações oficiais.
                  Entre em contato com nossa equipe para consultar as oportunidades disponíveis.
                </p>

                <a
                  href="#contato"
                  className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B00] transition hover:gap-4"
                >
                  Consultar oportunidades
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section
        id="diferenciais"
        className="scroll-mt-24 border-y border-white/[0.07] bg-[#101010] py-24 sm:py-28"
      >
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">

          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FF6B00]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FF6B00]">
                O padrão VTCAR
              </p>
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
              Mais que veículos.
              <br />
              <span className="text-[#C6A15B]">Uma experiência.</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#888]">
              Acreditamos que uma boa negociação começa com confiança, informação e respeito ao cliente.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description, number }) => (
              <article
                key={number}
                className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#151515] p-8 transition duration-300 hover:-translate-y-1 hover:border-[#FF6B00]/40"
              >
                <div className="absolute right-7 top-7 text-4xl font-black text-white/[0.035]">
                  {number}
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#FF6B00]/20 bg-[#FF6B00]/[0.07] text-[#FF6B00] transition group-hover:bg-[#FF6B00] group-hover:text-white">
                  <Icon size={26} strokeWidth={1.6} />
                </div>

                <h3 className="mt-8 text-lg font-bold text-white">{title}</h3>

                <p className="mt-3 text-sm leading-7 text-[#888]">
                  {description}
                </p>

                <div className="mt-8 h-px w-10 bg-[#C6A15B]/50 transition-all group-hover:w-full group-hover:bg-[#FF6B00]" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="scroll-mt-24 py-24 sm:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 md:grid-cols-2 md:items-center lg:px-12">

          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FF6B00]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FF6B00]">
                Nossa essência
              </p>
            </div>

            <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Movemos você em direção às suas{" "}
              <span className="text-[#FF6B00]">conquistas.</span>
            </h2>
          </div>

          <div className="border-l border-[#C6A15B]/40 pl-7 sm:pl-10">
            <p className="text-base leading-8 text-[#A1A1AA]">
              A VTCAR PREMIUM acredita que cada veículo representa mais do que uma escolha.
              Representa novos caminhos, objetivos e conquistas.
            </p>

            <p className="mt-5 text-base leading-8 text-[#A1A1AA]">
              Nosso compromisso é oferecer uma experiência automotiva moderna, transparente
              e personalizada, colocando o cliente no centro de cada negociação.
            </p>

            <p className="mt-8 text-xs font-bold tracking-[0.22em] text-[#C6A15B]">
              VTCAR PREMIUM — MOVEMOS CONQUISTAS.
            </p>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section
        id="contato"
        className="scroll-mt-24 px-5 pb-24 sm:px-8 sm:pb-28 lg:px-12"
      >
        <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-2xl border border-[#C6A15B]/20 bg-[#15120F]">

          <div className="pointer-events-none absolute -right-20 -top-40 h-96 w-96 rounded-full bg-[#FF6B00]/10 blur-[100px]" />

          <div className="relative grid gap-10 p-8 sm:p-14 lg:grid-cols-[1fr_auto] lg:items-center">

            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C6A15B]">
                Atendimento VTCAR PREMIUM
              </p>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                Sua próxima conquista merece uma experiência à altura.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#A1A1AA]">
                Converse com nossa equipe e descubra como podemos ajudar você a encontrar seu próximo veículo.
              </p>
            </div>

            <a
              href="mailto:atendimento.vtcar@gmail.com?subject=Atendimento%20VTCAR%20PREMIUM"
              className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-lg bg-[#FF6B00] px-7 text-xs font-extrabold uppercase tracking-wider text-white transition hover:-translate-y-0.5 hover:bg-[#D95700]"
            >
              Falar com a equipe
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#070707]">
        <div className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 lg:px-12">

          <div className="flex flex-col justify-between gap-9 md:flex-row md:items-center">

            <div>
              <BrandLogo />

              <p className="mt-5 max-w-sm text-xs leading-6 text-[#777]">
                Uma experiência automotiva construída sobre confiança, qualidade e compromisso.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-7 gap-y-4 text-xs font-medium text-[#888]">
              <a href="#estoque" className="transition hover:text-[#FF6B00]">
                Estoque
              </a>
              <a href="#diferenciais" className="transition hover:text-[#FF6B00]">
                Diferenciais
              </a>
              <a href="#sobre" className="transition hover:text-[#FF6B00]">
                Sobre nós
              </a>
              <a href="#contato" className="transition hover:text-[#FF6B00]">
                Contato
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/[0.07] pt-7 text-[10px] tracking-wider text-[#666] sm:flex-row">
            <p>
              © {new Date().getFullYear()} VTCAR PREMIUM. TODOS OS DIREITOS RESERVADOS.
            </p>

            <p className="font-bold tracking-[0.2em] text-[#C6A15B]">
              WE BUILD MOMENTUM.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
