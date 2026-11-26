
import {
  ArrowRight,
  ArrowUpRight,
  CarFront,
  CheckCircle2,
  ChevronDown,
  Instagram,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Transparência",
    description: "Informações claras para você negociar com segurança.",
  },
  {
    icon: CheckCircle2,
    title: "Atendimento premium",
    description: "Acompanhamento próximo em todas as etapas.",
  },
  {
    icon: Wallet,
    title: "Negociação facilitada",
    description: "Vamos encontrar uma solução adequada ao seu momento.",
  },
];

const categories = ["Todos", "Sedan", "SUV", "Hatch", "Picape", "Premium"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600">
              <CarFront size={25} />
            </span>
            <span className="text-sm font-black tracking-[.16em]">
              VTCAR <span className="text-cyan-300">PREMIUM</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#estoque" className="hover:text-cyan-300">Estoque</a>
            <a href="#diferenciais" className="hover:text-cyan-300">Diferenciais</a>
            <a href="#sobre" className="hover:text-cyan-300">Sobre nós</a>
            <a href="#contato" className="hover:text-cyan-300">Contato</a>
          </nav>

          <a href="#contato" className="primary-button !px-5 !py-3 text-sm">
            Fale com um consultor <ArrowUpRight size={16} />
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute -right-40 -top-20 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="container relative grid min-h-[680px] items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-xs font-semibold uppercase tracking-[.16em] text-cyan-200">
              <Sparkles size={14} />
              Uma nova experiência automotiva
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Seu próximo carro.
              <span className="gradient-text block">Seu próximo momento.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Encontre seu próximo veículo com uma experiência de compra
              transparente, atendimento personalizado e a confiança da
              VTCAR PREMIUM.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#estoque" className="primary-button">
                Explorar veículos <ArrowRight size={18} />
              </a>
              <a href="#contato" className="secondary-button">
                Falar com a equipe
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-7 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-cyan-300" />
                Atendimento personalizado
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-cyan-300" />
                Negociação transparente
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-8 rounded-full bg-blue-500/20 blur-[90px]" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#172c48] to-[#091321] p-8 shadow-2xl sm:p-12">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-[.2em] text-slate-300">
                  VTCAR PREMIUM
                </span>
                <span className="rounded-full border border-cyan-300/20 px-3 py-1 text-[10px] font-bold tracking-widest text-cyan-200">
                  WE BUILD MOMENTUM
                </span>
              </div>

              <div className="flex aspect-[4/3] flex-col items-center justify-center text-center">
                <div className="mb-7 grid h-28 w-28 place-items-center rounded-[2rem] border border-cyan-200/20 bg-cyan-200/10 text-cyan-200 shadow-2xl shadow-blue-950">
                  <CarFront size={65} strokeWidth={1.2} />
                </div>
                <p className="text-3xl font-black sm:text-4xl">
                  Dirija novas
                </p>
                <p className="mt-2 text-3xl font-black text-cyan-300 sm:text-4xl">
                  possibilidades.
                </p>
                <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
                  Uma escolha inteligente começa com uma boa experiência.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-400">
                <span>EXPERIÊNCIA PREMIUM</span>
                <span>01 / VTCAR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="estoque" className="scroll-mt-24 border-y border-white/10 bg-[#0a1727] py-24">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">
                Nosso estoque
              </p>
              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                Encontre seu próximo veículo.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-400">
                Explore as oportunidades disponíveis na VTCAR PREMIUM.
                Nosso catálogo está sendo preparado.
              </p>
            </div>
            <span className="text-sm text-slate-500">
              Catálogo oficial VTCAR PREMIUM
            </span>
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-[#0d1b2d] px-6 py-16 text-center sm:px-12">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/5 text-cyan-300">
              <CarFront size={38} />
            </div>
            <h3 className="mt-7 text-2xl font-bold">
              Estamos preparando nosso catálogo
            </h3>
            <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-400">
              Em breve você poderá visualizar veículos, fotos, preços,
              especificações e condições diretamente nesta página.
            </p>
            <a href="#contato" className="primary-button mt-8">
              Consultar oportunidades <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <section id="diferenciais" className="scroll-mt-24 py-24">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">
              Por que VTCAR?
            </p>
            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Comprar bem começa com confiança.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-[#0d1b2d] p-8 transition hover:-translate-y-1 hover:border-cyan-300/30"
              >
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-blue-500/10 text-cyan-300">
                  <Icon size={28} />
                </div>
                <h3 className="mt-7 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sobre" className="scroll-mt-24 border-y border-white/10 bg-[#0a1727] py-24">
        <div className="container grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">
              Nossa identidade
            </p>
            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              WE BUILD MOMENTUM.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-slate-300">
              A VTCAR PREMIUM nasce com o propósito de tornar a experiência
              automotiva mais simples, moderna e transparente. Queremos
              acompanhar você em cada conquista, oferecendo informação,
              proximidade e atendimento de qualidade.
            </p>
          </div>
        </div>
      </section>

      <section id="contato" className="scroll-mt-24 py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-blue-950 via-[#10233c] to-[#0b1728] p-8 sm:p-14">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-[90px]" />
            <div className="relative max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">
                Atendimento VTCAR PREMIUM
              </p>
              <h2 className="mt-5 text-4xl font-black sm:text-5xl">
                Vamos encontrar seu próximo veículo?
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Entre em contato com nossa equipe e conte o que você procura.
                Será um prazer acompanhar sua próxima conquista.
              </p>
              <a
                href="mailto:atendimento.vtcar@gmail.com?subject=Atendimento%20VTCAR%20PREMIUM"
                className="primary-button mt-9"
              >
                <MessageCircle size={19} />
                Solicitar atendimento
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-9">
        <div className="container flex flex-col justify-between gap-5 text-sm text-slate-500 sm:flex-row sm:items-center">
          <div>
            <p className="font-black tracking-[.14em] text-white">
              VTCAR <span className="text-cyan-300">PREMIUM</span>
            </p>
            <p className="mt-2">© {new Date().getFullYear()} Todos os direitos reservados.</p>
          </div>
          <p className="font-semibold tracking-[.2em]">WE BUILD MOMENTUM</p>
        </div>
      </footer>
    </main>
  );
}
