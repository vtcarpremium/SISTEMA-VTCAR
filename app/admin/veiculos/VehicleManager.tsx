
"use client";

import { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  Trash2,
  Star,
  RefreshCw,
  CarFront,
  Upload,
  Images,
  Save,
  Pencil,
} from "lucide-react";

type Vehicle = {
  id: string;
  title: string;
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
  status: "draft" | "published" | "paused" | "sold";
  featured: boolean;
};

type VehicleImage = {
  id: string;
  url: string | null;
  alt_text: string | null;
  position: number;
  is_cover: boolean;
};

type VehicleForm = {
  title: string;
  brand: string;
  model: string;
  version: string;
  manufactureYear: string;
  modelYear: string;
  price: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  color: string;
  description: string;
  status: Vehicle["status"];
  featured: boolean;
};

const emptyForm: VehicleForm = {
  title: "",
  brand: "",
  model: "",
  version: "",
  manufactureYear: "",
  modelYear: "",
  price: "",
  mileage: "",
  transmission: "",
  fuelType: "",
  color: "",
  description: "",
  status: "draft",
  featured: false,
};

const inputClass =
  "w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#071B35] outline-none transition focus:border-[#1677D2] focus:ring-2 focus:ring-[#1677D2]/20";

const labelClass =
  "mb-2 block text-sm font-semibold text-[#071B35]";

function parseBrazilianPrice(value: string): number {
  let normalized = value
    .trim()
    .replace(/R\$/gi, "")
    .replace(/\s/g, "");

  if (!normalized) return NaN;

  if (normalized.includes(",")) {
    normalized = normalized
      .replace(/\./g, "")
      .replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(normalized)) {
    normalized = normalized.replace(/\./g, "");
  }

  const price = Number(normalized);
  return Number.isFinite(price) ? price : NaN;
}

function formatBrazilianPrice(value: number | string): string {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) return "";

  return numericValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export default function VehicleManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [images, setImages] = useState<VehicleImage[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState<VehicleForm>(emptyForm);

  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fileInput = useRef<HTMLInputElement>(null);

  async function loadVehicles() {
    setLoadingVehicles(true);
    setError("");

    try {
      const response = await fetch("/api/admin/vehicles", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Não foi possível carregar os veículos."
        );
      }

      setVehicles(data.vehicles || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar veículos."
      );
    } finally {
      setLoadingVehicles(false);
    }
  }

  async function loadImages(vehicleId: string) {
    if (!vehicleId) {
      setImages([]);
      return;
    }

    setLoadingImages(true);

    try {
      const response = await fetch(
        `/api/admin/vehicles/${vehicleId}/images`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Não foi possível carregar as fotos.");
      }

      setImages(data.images || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar as fotos."
      );
      setImages([]);
    } finally {
      setLoadingImages(false);
    }
  }

  function fillForm(vehicle: Vehicle) {
    setForm({
      title: vehicle.title || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      version: vehicle.version || "",
      manufactureYear: String(vehicle.manufacture_year ?? ""),
      modelYear: String(vehicle.model_year ?? ""),
      price: formatBrazilianPrice(vehicle.price ?? 0),
      mileage: String(vehicle.mileage ?? ""),
      transmission: vehicle.transmission || "",
      fuelType: vehicle.fuel_type || "",
      color: vehicle.color || "",
      description: vehicle.description || "",
      status: vehicle.status || "draft",
      featured: vehicle.featured === true,
    });
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    const vehicle = vehicles.find(
      (item) => item.id === selectedVehicle
    );

    if (vehicle) {
      fillForm(vehicle);
    } else {
      setForm(emptyForm);
    }

    setFiles([]);
    setMessage("");
    setError("");
    loadImages(selectedVehicle);
  }, [selectedVehicle, vehicles]);

  function updateForm<K extends keyof VehicleForm>(
    key: K,
    value: VehicleForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function saveVehicle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedVehicle) return;

    const price = parseBrazilianPrice(form.price);
    const manufactureYear = Number(form.manufactureYear);
    const modelYear = Number(form.modelYear);
    const mileage = Number(form.mileage);

    if (!form.title.trim() || !form.brand.trim() || !form.model.trim()) {
      setError("Preencha o título, a marca e o modelo.");
      return;
    }

    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      price > 100000000 ||
      !Number.isInteger(manufactureYear) ||
      !Number.isInteger(modelYear) ||
      !Number.isInteger(mileage) ||
      manufactureYear < 1900 ||
      modelYear < 1900 ||
      manufactureYear > 2100 ||
      modelYear > 2100 ||
      mileage < 0 ||
      mileage > 10000000
    ) {
      setError("Confira o preço, os anos e a quilometragem informados.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/vehicles/${selectedVehicle}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title.trim(),
            brand: form.brand.trim(),
            model: form.model.trim(),
            version: form.version.trim() || null,
            manufactureYear,
            modelYear,
            price,
            mileage,
            transmission: form.transmission.trim() || null,
            fuelType: form.fuelType.trim() || null,
            color: form.color.trim() || null,
            description: form.description.trim() || null,
            status: form.status,
            featured: form.featured,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Não foi possível salvar as alterações."
        );
      }

      setMessage("Anúncio atualizado com sucesso!");

      await loadVehicles();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao atualizar o anúncio."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) return;

    const selected = Array.from(selectedFiles);

    if (selected.some((file) => file.size > 8 * 1024 * 1024)) {
      setError("Cada imagem deve ter no máximo 8 MB.");
      return;
    }

    if (
      selected.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
            file.type
          )
      )
    ) {
      setError("Use somente imagens JPEG, PNG, WebP ou AVIF.");
      return;
    }

    if (images.length + selected.length > 30) {
      setError("Cada veículo pode ter no máximo 30 fotos.");
      return;
    }

    setError("");
    setMessage("");
    setFiles(selected);
  }

  async function uploadImages() {
    if (!selectedVehicle || files.length === 0) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      let uploaded = 0;

      for (let index = 0; index < files.length; index++) {
        const formData = new FormData();

        formData.append("file", files[index]);
        formData.append(
          "isCover",
          String(images.length === 0 && index === 0)
        );
        formData.append("altText", files[index].name);

        const response = await fetch(
          `/api/admin/vehicles/${selectedVehicle}/images`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || `Falha ao enviar ${files[index].name}.`
          );
        }

        uploaded++;
      }

      setFiles([]);

      if (fileInput.current) {
        fileInput.current.value = "";
      }

      await loadImages(selectedVehicle);

      setMessage(
        uploaded === 1
          ? "Foto enviada com sucesso!"
          : `${uploaded} fotos enviadas com sucesso!`
      );
    } catch (err) {
      await loadImages(selectedVehicle);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível enviar as fotos."
      );
    } finally {
      setUploading(false);
    }
  }

  async function deleteImage(imageId: string) {
    const confirmed = window.confirm(
      "Tem certeza de que deseja excluir esta foto?"
    );

    if (!confirmed) return;

    setDeleting(imageId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/vehicles/${selectedVehicle}/images?imageId=${imageId}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Não foi possível excluir a foto.");
      }

      await loadImages(selectedVehicle);
      setMessage("Foto excluída com sucesso.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao excluir a foto."
      );
    } finally {
      setDeleting("");
    }
  }

  const currentVehicle = vehicles.find(
    (vehicle) => vehicle.id === selectedVehicle
  );

  return (
    <div className="space-y-7">
      <section className="rounded-2xl border border-[#E1E8F0] bg-white p-5 shadow-sm md:p-7">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#EAF4FF] p-3">
            <CarFront className="text-[#1677D2]" size={24} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#071B35]">
              Selecionar veículo
            </h2>
            <p className="text-sm text-[#64748B]">
              Escolha um anúncio para editar seus dados e fotografias.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="vehicle" className={labelClass}>
            Veículo do estoque
          </label>

          <select
            id="vehicle"
            value={selectedVehicle}
            onChange={(event) => setSelectedVehicle(event.target.value)}
            disabled={loadingVehicles}
            className={inputClass}
          >
            <option value="">
              {loadingVehicles
                ? "Carregando veículos..."
                : "Selecione um veículo"}
            </option>

            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.title} — {vehicle.brand} {vehicle.model} (
                {vehicle.manufacture_year}/{vehicle.model_year})
              </option>
            ))}
          </select>

          {!loadingVehicles && vehicles.length === 0 && (
            <p className="mt-3 text-sm text-[#64748B]">
              Nenhum veículo encontrado no estoque.
            </p>
          )}

          <button
            type="button"
            onClick={loadVehicles}
            disabled={loadingVehicles}
            className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#1677D2] hover:text-[#123B68]"
          >
            <RefreshCw
              size={14}
              className={loadingVehicles ? "animate-spin" : ""}
            />
            Atualizar lista
          </button>
        </div>
      </section>

      {selectedVehicle && (
        <>
          <section className="rounded-2xl border border-[#E1E8F0] bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#EAF4FF] p-3">
                <Pencil className="text-[#1677D2]" size={23} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#071B35]">
                  Editar anúncio
                </h2>
                <p className="text-sm text-[#64748B]">
                  Altere as informações que aparecem no anúncio do veículo.
                </p>
              </div>
            </div>

            <form onSubmit={saveVehicle} className="space-y-6">
              <div>
                <label className={labelClass}>Título do anúncio *</label>
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  maxLength={180}
                  required
                  placeholder="Ex.: Honda Civic Touring 1.5 Turbo"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelClass}>Marca *</label>
                  <input
                    className={inputClass}
                    value={form.brand}
                    onChange={(e) => updateForm("brand", e.target.value)}
                    maxLength={80}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Modelo *</label>
                  <input
                    className={inputClass}
                    value={form.model}
                    onChange={(e) => updateForm("model", e.target.value)}
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Versão</label>
                  <input
                    className={inputClass}
                    value={form.version}
                    onChange={(e) => updateForm("version", e.target.value)}
                    maxLength={100}
                    placeholder="Ex.: Touring 1.5 Turbo"
                  />
                </div>

                <div>
                  <label className={labelClass}>Ano de fabricação *</label>
                  <input
                    className={inputClass}
                    type="number"
                    min="1900"
                    max="2100"
                    value={form.manufactureYear}
                    onChange={(e) =>
                      updateForm("manufactureYear", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Ano do modelo *</label>
                  <input
                    className={inputClass}
                    type="number"
                    min="1900"
                    max="2100"
                    value={form.modelYear}
                    onChange={(e) =>
                      updateForm("modelYear", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Preço (R$) *</label>
                  <input
                    className={inputClass}
                    type="text"
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => updateForm("price", e.target.value)}
                    required
                    placeholder="125.000,00"
                  />
                  <p className="mt-1 text-xs text-[#64748B]">
                    Ex.: 125.000 ou 125.000,00
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Quilometragem *</label>
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    value={form.mileage}
                    onChange={(e) => updateForm("mileage", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Câmbio</label>
                  <select
                    className={inputClass}
                    value={form.transmission}
                    onChange={(e) =>
                      updateForm("transmission", e.target.value)
                    }
                  >
                    <option value="">Não informado</option>
                    <option value="Manual">Manual</option>
                    <option value="Automático">Automático</option>
                    <option value="CVT">CVT</option>
                    <option value="Automatizado">Automatizado</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Combustível</label>
                  <select
                    className={inputClass}
                    value={form.fuelType}
                    onChange={(e) => updateForm("fuelType", e.target.value)}
                  >
                    <option value="">Não informado</option>
                    <option value="Flex">Flex</option>
                    <option value="Gasolina">Gasolina</option>
                    <option value="Etanol">Etanol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Elétrico">Elétrico</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Cor</label>
                  <input
                    className={inputClass}
                    value={form.color}
                    onChange={(e) => updateForm("color", e.target.value)}
                    maxLength={60}
                    placeholder="Ex.: Preto"
                  />
                </div>

                <div>
                  <label className={labelClass}>Situação do anúncio</label>
                  <select
                    className={inputClass}
                    value={form.status}
                    onChange={(e) =>
                      updateForm("status", e.target.value as Vehicle["status"])
                    }
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                    <option value="paused">Pausado</option>
                    <option value="sold">Vendido</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Descrição do veículo</label>
                <textarea
                  className={`${inputClass} min-h-36 resize-y`}
                  value={form.description}
                  onChange={(e) =>
                    updateForm("description", e.target.value)
                  }
                  maxLength={5000}
                  placeholder="Descreva os equipamentos, opcionais, estado de conservação e diferenciais do veículo..."
                />
                <p className="mt-1 text-right text-xs text-[#64748B]">
                  {form.description.length}/5000 caracteres
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#CBD5E1] bg-[#F4F8FD] p-4">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateForm("featured", e.target.checked)}
                  className="h-5 w-5 accent-[#1677D2]"
                />
                <span>
                  <span className="block text-sm font-bold text-[#071B35]">
                    Destacar este veículo
                  </span>
                  <span className="text-xs text-[#64748B]">
                    Marque para dar destaque ao anúncio no portal.
                  </span>
                </span>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1677D2] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#123B68] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Salvando alterações..." : "Salvar alterações"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-[#E1E8F0] bg-white p-5 shadow-sm md:p-7">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#EAF4FF] p-3">
                <Upload className="text-[#1677D2]" size={23} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#071B35]">
                  Adicionar fotografias
                </h2>
                <p className="text-sm text-[#64748B]">
                  {currentVehicle?.title}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border-2 border-dashed border-[#B9D8F5] bg-[#F4F8FD] p-6 text-center">
              <ImagePlus size={34} className="mx-auto text-[#1677D2]" />

              <p className="mt-3 font-semibold text-[#071B35]">
                Selecione as fotos do veículo
              </p>

              <p className="mt-1 text-xs text-[#64748B]">
                JPEG, PNG, WebP ou AVIF. Máximo de 8 MB por foto.
              </p>

              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                onChange={(event) => handleFiles(event.target.files)}
                className="hidden"
                id="vehicle-images"
              />

              <label
                htmlFor="vehicle-images"
                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1677D2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#123B68]"
              >
                <ImagePlus size={17} />
                Escolher imagens
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-[#071B35]">
                  {files.length} arquivo(s) selecionado(s)
                </p>

                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-lg bg-[#F4F7FB] px-4 py-3"
                    >
                      <span className="truncate text-sm text-[#071B35]">
                        {file.name}
                      </span>

                      <span className="ml-3 shrink-0 text-xs text-[#64748B]">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={uploadImages}
                  disabled={uploading}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#071B35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#123B68] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload size={18} />
                  {uploading ? "Enviando imagens..." : "Enviar fotos"}
                </button>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#E1E8F0] bg-white p-5 shadow-sm md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#EAF4FF] p-3">
                  <Images className="text-[#1677D2]" size={23} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#071B35]">
                    Galeria do veículo
                  </h2>
                  <p className="text-sm text-[#64748B]">
                    {images.length} de 30 fotos
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => loadImages(selectedVehicle)}
                disabled={loadingImages}
                className="flex items-center gap-2 rounded-lg border border-[#CBD5E1] px-3 py-2 text-xs font-semibold text-[#123B68] hover:bg-[#F4F7FB] disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={loadingImages ? "animate-spin" : ""}
                />
                Atualizar
              </button>
            </div>

            {loadingImages ? (
              <div className="py-12 text-center text-sm text-[#64748B]">
                Carregando galeria...
              </div>
            ) : images.length === 0 ? (
              <div className="mt-6 rounded-xl bg-[#F4F7FB] px-5 py-12 text-center">
                <Images size={35} className="mx-auto text-[#94A3B8]" />
                <p className="mt-3 font-semibold text-[#071B35]">
                  Nenhuma foto cadastrada
                </p>
                <p className="mt-1 text-sm text-[#64748B]">
                  Selecione imagens acima para montar a galeria.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-xl border border-[#E1E8F0] bg-white"
                  >
                    <div className="relative aspect-[4/3] bg-[#F4F7FB]">
                      {image.url ? (
                        <img
                          src={image.url}
                          alt={image.alt_text || "Foto do veículo"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[#64748B]">
                          Imagem indisponível
                        </div>
                      )}

                      {image.is_cover && (
                        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#071B35] px-2.5 py-1 text-[10px] font-bold text-white">
                          <Star size={11} />
                          CAPA
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 p-3">
                      <span className="truncate text-xs text-[#64748B]">
                        {image.alt_text || "Foto do veículo"}
                      </span>

                      <button
                        type="button"
                        onClick={() => deleteImage(image.id)}
                        disabled={deleting === image.id}
                        title="Excluir foto"
                        aria-label="Excluir foto"
                        className="shrink-0 rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-[#123B68]"
        >
          {message}
        </div>
      )}
    </div>
  );
}
