"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2, LogOut } from "lucide-react";
import { adminLogout, isAdminLoggedIn } from "@/lib/admin-auth";
import { COMPANY } from "@/lib/data/company";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminOverview } from "./admin-overview";
import { AdminPricing } from "./admin-pricing";
import { AdminSlots } from "./admin-slots";
import { AdminSettings } from "./admin-settings";

/**
 * Panel protegido: verifica la sesión en el cliente y redirige al
 * login si no hay una activa. En producción esto es middleware de
 * servidor + Clerk con rol VENUE_OWNER.
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
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
        <Skeleton className="h-14 w-80" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
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

      <Tabs defaultValue="resumen" className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="precios">Canchas y precios</TabsTrigger>
          <TabsTrigger value="turnos">Turnos</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen">
          <AdminOverview />
        </TabsContent>
        <TabsContent value="precios">
          <AdminPricing />
        </TabsContent>
        <TabsContent value="turnos">
          <AdminSlots />
        </TabsContent>
        <TabsContent value="config">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
