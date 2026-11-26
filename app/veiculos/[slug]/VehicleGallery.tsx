
"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CarFront, Maximize2 } from "lucide-react";

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

  const previous = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? validImages.length - 1 : current - 1
    );
  }, [validImages.length]);

  const next = useCallback(() => {
    setActiveIndex((current) =>
      current === validImages.length - 1 ? 0 : current + 1
    );
  }, [validImages.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previous, next]);

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
    <div className="w-full overflow-hidden rounded-2xl border border-[#E1E8F0] bg-white">
      <div className="group relative aspect-[16/10] w-full overflow-hidden bg-[#EAF0F6]">
        <img
          key={activeImage.id}
          src={activeImage.image_url!}
          alt={activeImage.alt_text || title}
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

        <span className="absolute left-4 top-4 rounded-lg bg-[#1677D2] px-3 py-2 text-[10px] font-bold text-white shadow">
          VTCAR PREMIUM
        </span>

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

            <div className="absolute bottom-4 right-4 rounded-full bg-[#071B35]/80 px-4 py-2 text-xs font-bold text-white backdrop-blur">
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
          {validImages.length} {validImages.length === 1 ? "foto disponível" : "fotos disponíveis"}
        </span>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#8293A7]">
          <Maximize2 size={12} />
          Galeria do veículo
        </span>
      </div>
    </div>
  );
}
