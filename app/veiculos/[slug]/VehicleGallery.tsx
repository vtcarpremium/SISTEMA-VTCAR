
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CarFront,
  Maximize2,
  Minimize2,
  X,
  ZoomIn,
} from "lucide-react";

type GalleryImage = {
  id: string;
  image_url: string | null;
  alt_text: string | null;
  position: number;
  is_cover: boolean;
};

export default function VehicleGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const validImages = images.filter((image) => Boolean(image.image_url));

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const previous = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? validImages.length - 1 : current - 1
    );
    setZoomed(false);
  }, [validImages.length]);

  const next = useCallback(() => {
    setActiveIndex((current) =>
      current === validImages.length - 1 ? 0 : current + 1
    );
    setZoomed(false);
  }, [validImages.length]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoomed(false);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
        return;
      }

      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();

      if (event.key === " " && lightboxOpen) {
        event.preventDefault();
        setZoomed((current) => !current);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previous, next, closeLightbox, lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen]);

  if (validImages.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl bg-[#EAF0F6]">
        <CarFront
          size={100}
          strokeWidth={1}
          className="text-[#9CB1C7]"
        />
      </div>
    );
  }

  const activeImage = validImages[activeIndex];

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-[#E1E8F0] bg-white">
        <div className="group relative aspect-[16/10] w-full overflow-hidden bg-[#EAF0F6]">
          <button
            type="button"
            onClick={() => {
              setZoomed(false);
              setLightboxOpen(true);
            }}
            aria-label="Ampliar foto do veículo"
            className="absolute inset-0 z-0 h-full w-full cursor-zoom-in"
          >
            <img
              key={activeImage.id}
              src={activeImage.image_url!}
              alt={activeImage.alt_text || title}
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.02]"
            />
          </button>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

          <span className="pointer-events-none absolute left-4 top-4 rounded-lg bg-[#1677D2] px-3 py-2 text-[10px] font-bold text-white shadow">
            VTCAR PREMIUM
          </span>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Abrir foto em tela cheia"
            className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-white/40 bg-[#071B35]/80 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur transition hover:bg-[#1677D2]"
          >
            <Maximize2 size={15} />
            Ampliar foto
          </button>

          {validImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={previous}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-[#071B35]/75 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-[#071B35]"
              >
                <ChevronLeft size={27} />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-[#071B35]/75 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-[#071B35]"
              >
                <ChevronRight size={27} />
              </button>

              <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-[#071B35]/80 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                {activeIndex + 1} / {validImages.length}
              </div>
            </>
          )}
        </div>

        {validImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto p-3">
            {validImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver foto ${index + 1}`}
                aria-current={index === activeIndex}
                className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 bg-[#EAF0F6] transition ${
                  index === activeIndex
                    ? "border-[#1677D2] ring-2 ring-[#1677D2]/20"
                    : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={image.image_url!}
                  alt={image.alt_text || `${title} - foto ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#E1E8F0] px-4 py-3">
          <span className="text-xs font-medium text-[#64748B]">
            {validImages.length}{" "}
            {validImages.length === 1
              ? "foto disponível"
              : "fotos disponíveis"}
          </span>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="flex items-center gap-1 text-[10px] font-semibold text-[#1677D2] hover:text-[#123B68]"
          >
            <Maximize2 size={13} />
            Ver em tela cheia
          </button>
        </div>
      </div>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria ampliada de ${title}`}
          onClick={closeLightbox}
          className="fixed inset-0 z-[9999] flex flex-col bg-[#020914]/95 backdrop-blur-sm"
        >
          <div
            className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4 sm:px-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {title}
              </p>

              <p className="mt-1 text-xs text-white/60">
                Foto {activeIndex + 1} de {validImages.length}
              </p>
            </div>

            <div className="ml-3 flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomed((current) => !current)}
                aria-label={zoomed ? "Reduzir imagem" : "Ampliar imagem"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                {zoomed ? (
                  <Minimize2 size={20} />
                ) : (
                  <ZoomIn size={21} />
                )}
              </button>

              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Fechar galeria"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-600"
              >
                <X size={23} />
              </button>
            </div>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto p-3 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={previous}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#071B35]/90 text-white shadow-lg transition hover:bg-[#1677D2] sm:left-6 sm:h-14 sm:w-14"
              >
                <ChevronLeft size={30} />
              </button>
            )}

            <img
              key={activeImage.id}
              src={activeImage.image_url!}
              alt={activeImage.alt_text || title}
              draggable={false}
              onClick={() => setZoomed((current) => !current)}
              className={`max-h-full max-w-full select-none object-contain transition-transform duration-300 ${
                zoomed
                  ? "scale-150 cursor-zoom-out sm:scale-[1.8]"
                  : "scale-100 cursor-zoom-in"
              }`}
            />

            {validImages.length > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Próxima foto"
                className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#071B35]/90 text-white shadow-lg transition hover:bg-[#1677D2] sm:right-6 sm:h-14 sm:w-14"
              >
                <ChevronRight size={30} />
              </button>
            )}
          </div>

          <div
            className="flex shrink-0 items-center justify-center gap-3 border-t border-white/10 px-4 py-4"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="text-xs font-semibold text-white/70">
              {activeIndex + 1} / {validImages.length}
            </span>

            <span className="text-xs text-white/40">
              Toque na foto para ampliar ou reduzir
            </span>
          </div>
        </div>
      )}
    </>
  );
}
