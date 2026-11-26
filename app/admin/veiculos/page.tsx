
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CarFront } from "lucide-react";

import { getCurrentUser } from "../../../lib/auth";
import { hasPermission } from "../../../lib/permissions";
import VehicleAdminPanel from "./VehicleAdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminVehiclesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!hasPermission(user.role, "vehicles.view")) {
    redirect("/acesso-negado");
  }

  const canCreate = hasPermission(user.role, "vehicles.create");

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <header className="border-b border-white/10 bg-[#071B35]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-[#1677D2] p-3">
              <CarFront size={24} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-black text-white">
                VT<span className="text-[#55B8FF]">CAR</span>
              </h1>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-[#B9D8F5]">
                PREMIUM
              </p>
            </div>
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-9 md:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] text-[#1677D2]">
            ADMINISTRAÇÃO
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#071B35]">
            Gerenciamento de veículos
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
            Cadastre veículos, gerencie os anúncios do estoque e
            administre as fotografias de cada automóvel.
          </p>
        </div>

        <VehicleAdminPanel canCreate={canCreate} />

        <footer className="mt-12 border-t border-[#E1E8F0] py-6 text-center">
          <p className="text-xs font-semibold tracking-wide text-[#64748B]">
            VTCAR PREMIUM
          </p>
          <p className="mt-1 text-[10px] tracking-[0.2em] text-[#1677D2]">
            MOVEMOS CONQUISTAS
          </p>
        </footer>
      </div>
    </main>
  );
}
