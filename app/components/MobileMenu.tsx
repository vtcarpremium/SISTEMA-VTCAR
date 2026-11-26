"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LogIn,
  MessageCircle,
  CarFront,
  ChevronRight,
} from "lucide-react";

const links = [
  { label: "Início", href: "/" },
  { label: "Estoque de veículos", href: "/#estoque" },
  { label: "Avaliação de veículos", href: "/#avaliacao" },
  { label: "Financiamento", href: "/#financiamento" },
  { label: "Aprove seu crédito", href: "/#credito" },
  { label: "Nossa empresa", href: "/#empresa" },
  { label: "Contato", href: "/#contato" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de conhecer melhor os veículos da VTCAR PREMIUM."
  );

  const whatsappUrl = `https://wa.me/5581992968347?text=${whatsappMessage}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={isOpen}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 text-white transition hover:border-[#55B8FF] hover:bg-white/10 xl:hidden"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[#071B35]/70 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            onClick={(event) => event.stopPropagation()}
            className="ml-auto flex h-full w-full max-w-[380px] flex-col overflow-y-auto bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E1E8F0] bg-[#071B35] px-6 py-5">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex flex-col leading-none"
              >
                <span className="text-2xl font-black tracking-tight text-white">
                  VT<span className="text-[#55B8FF]">CAR</span>
                </span>
                <span className="mt-1 text-[9px] font-bold tracking-[0.36em] text-[#B9D8F5]">
                  PREMIUM
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar menu"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 px-5 py-6">
              <p className="mb-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8293A7]">
                Navegação
              </p>

              <nav className="space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex min-h-12 items-center justify-between rounded-xl px-3 text-sm font-semibold text-[#123B68] transition hover:bg-[#EAF4FF] hover:text-[#1677D2]"
                  >
                    {link.label}
                    <ChevronRight size={17} className="text-[#8AA6C2]" />
                  </Link>
                ))}
              </nav>

              <div className="my-6 border-t border-[#E1E8F0]" />

              <p className="mb-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8293A7]">
                Área do parceiro
              </p>

              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex min-h-14 items-center gap-3 rounded-xl border border-[#B9D8F5] bg-[#F4F8FD] px-4 text-sm font-bold text-[#123B68] transition hover:border-[#1677D2] hover:bg-[#EAF4FF]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1677D2] text-white">
                  <LogIn size={19} />
                </span>
                <span className="flex-1">Login do parceiro</span>
                <ChevronRight size={18} />
              </Link>

              <div className="mt-6 rounded-xl bg-[#F4F7FB] p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#071B35]">
                  <CarFront size={19} className="text-[#1677D2]" />
                  VTCAR PREMIUM
                </div>
                <p className="mt-2 text-xs leading-5 text-[#64748B]">
                  Encontre seu próximo veículo com atendimento especializado.
                </p>
              </div>
            </div>

            <div className="border-t border-[#E1E8F0] p-5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1677D2] px-4 text-sm font-bold text-white transition hover:bg-[#0D5EAD]"
              >
                <MessageCircle size={19} />
                Falar com a VTCAR
              </a>

              <p className="mt-4 text-center text-[10px] font-medium tracking-wider text-[#8293A7]">
                MOVEMOS CONQUISTAS
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
