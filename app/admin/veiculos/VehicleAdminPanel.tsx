
"use client";

import { useState } from "react";
import { Plus, ArrowLeft, CheckCircle2 } from "lucide-react";
import VehicleManager from "./VehicleManager";
import VehicleCreateForm from "./VehicleCreateForm";

type Props = {
  canCreate: boolean;
};

export default function VehicleAdminPanel({ canCreate }: Props) {
  const [mode, setMode] = useState<"manage" | "create">("manage");
  const [createdMessage, setCreatedMessage] = useState("");

  function handleCreated(vehicleId: string) {
    setCreatedMessage(
      `Veículo cadastrado com sucesso! Identificador: ${vehicleId}`
    );
    setMode("manage");
  }

  return (
    <div className="space-y-6">
      {mode === "create" ? (
        <>
          <button
            type="button"
            onClick={() => setMode("manage")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm font-semibold text-[#123B68] transition hover:bg-[#F4F7FB]"
          >
            <ArrowLeft size={17} />
            Voltar ao estoque
          </button>

          <VehicleCreateForm
            onCreated={handleCreated}
            onCancel={() => setMode("manage")}
          />
        </>
      ) : (
        <>
          {canCreate && (
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#B9D8F5] bg-white p-5 shadow-sm sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold text-[#071B35]">
                  Estoque de veículos
                </h3>
                <p className="mt-1 text-sm text-[#64748B]">
                  Cadastre novos carros e gerencie os anúncios existentes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCreatedMessage("");
                  setMode("create");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1677D2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#123B68]"
              >
                <Plus size={19} />
                Cadastrar veículo
              </button>
            </div>
          )}

          {createdMessage && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-[#123B68]"
            >
              <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Cadastro concluído!</p>
                <p className="mt-1">
                  O veículo já está no estoque. Selecione-o na lista abaixo
                  para editar os dados e adicionar as fotografias.
                </p>
              </div>
            </div>
          )}

          <VehicleManager />
        </>
      )}
    </div>
  );
}
