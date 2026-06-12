"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2, CalendarClock, CircleDollarSign, LogOut, Settings } from "lucide-react";
import { adminLogout, isAdminLoggedIn } from "@/lib/admin-auth";
import { COMPANY } from "@/lib/data/company";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPricing } from "./admin-pricing";
import { AdminSlots } from "./admin-slots";
import { AdminSettings } from "./admin-settings";

/**
 * Panel simple en una sola pantalla: turnos, precios y configuración.
 * Protegido con sesión; sin sesión redirige al login. En producción
 * esto es middleware de servidor + Clerk con rol VENUE_OWNER.
 */
export function AdminPanel() {
  const router = useRouter();
  const [authed, setAuthed] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (isAdminLoggedIn()) {
      setAuthed(true);
    } else {
      setAuthed(false);
      router.replace("/admin/login");
    }
  }, [router]);

  if (!authed) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
        <Skeleton className="h-14 w-80" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="size-4" />
            <span>{COMPANY.name}</span>
            <Badge variant="success">Sesión activa</Badge>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Panel de administración
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            adminLogout();
            router.replace("/admin/login");
          }}
        >
          <LogOut />
          Cerrar sesión
        </Button>
      </div>

      {/* ── Turnos ── */}
      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <CalendarClock className="size-5 text-primary" />
          Turnos
        </h2>
        <div className="mt-4">
          <AdminSlots />
        </div>
      </section>

      {/* ── Precios ── */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <CircleDollarSign className="size-5 text-primary" />
          Precios por cancha
        </h2>
        <div className="mt-4">
          <AdminPricing />
        </div>
      </section>

      {/* ── Configuración ── */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Settings className="size-5 text-primary" />
          Configuración
        </h2>
        <div className="mt-4">
          <AdminSettings />
        </div>
      </section>
    </div>
  );
}
