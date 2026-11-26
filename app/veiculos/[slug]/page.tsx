
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CarFront,
  Fuel,
  Gauge,
  MapPin,
  MessageCircle,
  Settings2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { query } from "../../../lib/db";
import { createImageDownloadUrl } from "../../../lib/storage";
import VehicleGallery from "./VehicleGallery";

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
  description: string | null;
};

type VehicleImage = {
  id: string;
  image_url: string | null;
  storage_key: string | null;
  alt_text: string | null;
  position: number;
  is_cover: boolean;
};

async function getVehicle(slug: string) {
  const result = await query<Vehicle>(
    `SELECT id, title, slug, brand, model, version,
      manufacture_year, model_year, price, mileage,
      transmission, fuel_type, color, description
     FROM vehicles
     WHERE slug = $1 AND status = 'published'
     LIMIT 1`,
    [slug]
  );

  return result.rows[0] || null;
}

async function getImages(vehicleId: string) {
  const result = await query<VehicleImage>(
    `SELECT id, image_url, storage_key, alt_text, position, is_cover
     FROM vehicle_images
     WHERE vehicle_id = $1
     ORDER BY is_cover DESC, position ASC, created_at ASC`,
    [vehicleId]
  );

  return Promise.all(
    result.rows.map(async (image) => {
      let imageUrl: string | null = null;

      if (image.storage_key) {
        imageUrl = await createImageDownloadUrl(image.storage_key);
      } else if (
        image.image_url &&
        !image.image_url.startsWith("storage://")
      ) {
        imageUrl = image.image_url;
      }

      return {
        ...image,
        image_url: imageUrl,
      };
    })
  );
}

function money(value: number | string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function Specification({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E1E8F0] bg-white p-4">
      <div className="rounded-lg bg-[#EAF4FF] p-3">
        <Icon size={20} className="text-[#1677D2]" />
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8293A7]">
          {label}
        </p>

        <p className="mt-1 text-sm font-bold text-[#071B35]">
          {value}
        </p>
      </div>
    </div>
  );
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const vehicle = await getVehicle(slug);

  if (!vehicle) notFound();

  const images = await getImages(vehicle.id);

  const validImages = images.filter(
    (image) => Boolean(image.image_url)
  );

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no veículo ${vehicle.title}. Gostaria de receber mais informações.`
  );

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#10243D]">
      <header className="border-b border-white/10 bg-[#071B35]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-2xl font-black text-white">
              VT<span className="text-[#55B8FF]">CAR</span>
            </span>

            <span className="mt-1 text-[9px] font-bold tracking-[0.36em] text-[#B9D8F5]">
              PREMIUM
            </span>
          </Link>

          <Link
            href="/#estoque"
            className="flex items-center gap-2 text-xs font-semibold text-white transition hover:text-[#55B8FF]"
          >
            <ArrowLeft size={16} />
            Voltar ao estoque
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-7">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
          <Link href="/" className="hover:text-[#1677D2]">
            Início
          </Link>

          <span>/</span>

          <Link
            href="/#estoque"
            className="hover:text-[#1677D2]"
          >
            Estoque
          </Link>

          <span>/</span>

          <span className="font-semibold text-[#123B68]">
            {vehicle.model}
          </span>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[1fr_380px]">
          <section>
            {/* GALERIA INTERATIVA */}
            <VehicleGallery
              images={validImages}
              title={vehicle.title}
            />

            {/* FICHA TÉCNICA */}
            <div className="mt-6 rounded-2xl border border-[#E1E8F0] bg-white p-6">
              <h2 className="text-xl font-black text-[#071B35]">
                Ficha técnica
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Specification
                  icon={CarFront}
                  label="Marca"
                  value={vehicle.brand}
                />

                <Specification
                  icon={CarFront}
                  label="Modelo"
                  value={vehicle.model}
                />

                <Specification
                  icon={CalendarDays}
                  label="Ano"
                  value={`${vehicle.manufacture_year}/${vehicle.model_year}`}
                />

                <Specification
                  icon={Gauge}
                  label="Quilometragem"
                  value={`${Number(vehicle.mileage).toLocaleString("pt-BR")} km`}
                />

                <Specification
                  icon={Settings2}
                  label="Câmbio"
                  value={vehicle.transmission || "Consulte"}
                />

                <Specification
                  icon={Fuel}
                  label="Combustível"
                  value={vehicle.fuel_type || "Consulte"}
                />

                <Specification
                  icon={CarFront}
                  label="Cor"
                  value={vehicle.color || "Consulte"}
                />

                <Specification
                  icon={ShieldCheck}
                  label="Versão"
                  value={vehicle.version || "Consulte"}
                />
              </div>
            </div>

            {/* DESCRIÇÃO */}
            {vehicle.description && (
              <div className="mt-6 rounded-2xl border border-[#E1E8F0] bg-white p-6">
                <h2 className="text-xl font-black text-[#071B35]">
                  Sobre este veículo
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#64748B]">
                  {vehicle.description}
                </p>
              </div>
            )}
          </section>

          {/* INFORMAÇÕES E CONTATO */}
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-[#E1E8F0] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1677D2]">
                VTCAR PREMIUM
              </p>

              <h1 className="mt-3 text-2xl font-black leading-tight text-[#071B35]">
                {vehicle.title}
              </h1>

              {vehicle.version && (
                <p className="mt-2 text-sm text-[#64748B]">
                  {vehicle.version}
                </p>
              )}

              <div className="my-6 border-y border-[#E1E8F0] py-5">
                <p className="text-xs font-medium text-[#8293A7]">
                  PREÇO DO VEÍCULO
                </p>

                <p className="mt-2 text-3xl font-black text-[#123B68]">
                  {money(vehicle.price)}
                </p>
              </div>

              <div className="space-y-4 text-sm text-[#64748B]">
                <div className="flex items-center gap-3">
                  <Gauge size={17} className="text-[#1677D2]" />
                  {Number(vehicle.mileage).toLocaleString("pt-BR")} km
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays
                    size={17}
                    className="text-[#1677D2]"
                  />
                  Ano {vehicle.manufacture_year}/{vehicle.model_year}
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={17} className="text-[#1677D2]" />
                  Consulte a localização
                </div>
              </div>

              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1677D2] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#0D5EAD]"
              >
                <MessageCircle size={19} />
                Tenho interesse neste veículo
                <ArrowUpRight size={17} />
              </a>

              <a
                href="mailto:atendimento.vtcar@gmail.com"
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-[#B9D8F5] px-5 py-3 text-xs font-bold text-[#123B68] transition hover:bg-[#EAF4FF]"
              >
                Enviar e-mail
              </a>

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#F4F7FB] p-4">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-[#1677D2]"
                />

                <p className="text-[11px] leading-5 text-[#64748B]">
                  Entre em contato com nossa equipe para confirmar
                  disponibilidade, condições e informações do veículo.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <footer className="mt-12 bg-[#071B35] px-5 py-8 text-center text-xs text-white/60">
        <p className="font-bold tracking-widest text-white">
          VTCAR PREMIUM
        </p>

        <p className="mt-2 text-[10px] tracking-[0.2em] text-[#B9D8F5]">
          MOVEMOS CONQUISTAS
        </p>
      </footer>
    </main>
  );
}
