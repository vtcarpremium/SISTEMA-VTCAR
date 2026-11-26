
"use client";

import { useState } from "react";
import { CarFront, Save, X } from "lucide-react";

type Props = {
  onCreated: (vehicleId: string) => void;
  onCancel: () => void;
};

const initialForm = {
  title: "",
  brand: "",
  model: "",
  version: "",
  manufactureYear: "",
  modelYear: "",
  price: "",
  mileage: "0",
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

  const result = Number(normalized);

  return Number.isFinite(result) ? result : NaN;
}

export default function VehicleCreateForm({
  onCreated,
  onCancel,
}: Props) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof typeof initialForm>(
    key: K,
    value: (typeof initialForm)[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

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
      manufactureYear < 1900 ||
      modelYear < 1900 ||
      manufactureYear > 2100 ||
      modelYear > 2100 ||
      !Number.isInteger(mileage) ||
      mileage < 0 ||
      mileage > 10000000
    ) {
      setError("Confira o preço, os anos e a quilometragem.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/vehicles", {
        method: "POST",
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
          transmission: form.transmission || null,
          fuelType: form.fuelType || null,
          color: form.color.trim() || null,
          description: form.description.trim() || null,
          status: form.status,
          featured: form.featured,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.vehicle?.id) {
        throw new Error(
          data.message || "Não foi possível cadastrar o veículo."
        );
      }

      onCreated(data.vehicle.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao cadastrar o veículo."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#B9D8F5] bg-white p-5 shadow-sm md:p-7">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#EAF4FF] p-3">
            <CarFront size={24} className="text-[#1677D2]" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#071B35]">
              Cadastrar novo veículo
            </h2>
            <p className="text-sm text-[#64748B]">
              Preencha os dados para adicionar ao estoque.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          aria-label="Cancelar cadastro"
          className="rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#071B35]"
        >
          <X size={21} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={labelClass}>Título do anúncio *</label>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
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
              onChange={(e) => update("brand", e.target.value)}
              maxLength={80}
              required
              placeholder="Ex.: Honda"
            />
          </div>

          <div>
            <label className={labelClass}>Modelo *</label>
            <input
              className={inputClass}
              value={form.model}
              onChange={(e) => update("model", e.target.value)}
              maxLength={100}
              required
              placeholder="Ex.: Civic"
            />
          </div>

          <div>
            <label className={labelClass}>Versão</label>
            <input
              className={inputClass}
              value={form.version}
              onChange={(e) => update("version", e.target.value)}
              maxLength={100}
              placeholder="Ex.: Touring"
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
              onChange={(e) => update("manufactureYear", e.target.value)}
              required
              placeholder="2024"
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
              onChange={(e) => update("modelYear", e.target.value)}
              required
              placeholder="2025"
            />
          </div>

          <div>
            <label className={labelClass}>Preço (R$) *</label>
            <input
              className={inputClass}
              type="text"
              inputMode="decimal"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              required
              placeholder="125.000,00"
            />
            <p className="mt-1 text-xs text-[#64748B]">
              Aceita 125.000, 125000 ou 125.000,00.
            </p>
          </div>

          <div>
            <label className={labelClass}>Quilometragem *</label>
            <input
              className={inputClass}
              type="number"
              min="0"
              max="10000000"
              value={form.mileage}
              onChange={(e) => update("mileage", e.target.value)}
              required
              placeholder="35000"
            />
          </div>

          <div>
            <label className={labelClass}>Câmbio</label>
            <select
              className={inputClass}
              value={form.transmission}
              onChange={(e) => update("transmission", e.target.value)}
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
              onChange={(e) => update("fuelType", e.target.value)}
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
              onChange={(e) => update("color", e.target.value)}
              maxLength={60}
              placeholder="Ex.: Preto"
            />
          </div>

          <div>
            <label className={labelClass}>Situação inicial</label>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="paused">Pausado</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Descrição do veículo</label>
          <textarea
            className={`${inputClass} min-h-36 resize-y`}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            maxLength={5000}
            placeholder="Informe opcionais, equipamentos, estado de conservação e diferenciais..."
          />
          <p className="mt-1 text-right text-xs text-[#64748B]">
            {form.description.length}/5000 caracteres
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#CBD5E1] bg-[#F4F8FD] p-4">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="h-5 w-5 accent-[#1677D2]"
          />
          <span>
            <span className="block text-sm font-bold text-[#071B35]">
              Destacar este veículo
            </span>
            <span className="text-xs text-[#64748B]">
              Dar destaque ao anúncio no portal.
            </span>
          </span>
        </label>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-xl border border-[#CBD5E1] px-5 py-3 text-sm font-semibold text-[#123B68] hover:bg-[#F4F7FB] disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1677D2] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#123B68] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Cadastrando..." : "Cadastrar veículo"}
          </button>
        </div>
      </form>
    </section>
  );
}
