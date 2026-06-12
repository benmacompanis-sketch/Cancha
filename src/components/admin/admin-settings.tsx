"use client";

import * as React from "react";
import { Check, RotateCcw } from "lucide-react";
import { COMPANY } from "@/lib/data/company";
import {
  getAdminSettings,
  resetAdminSettings,
  saveAdminSettings,
} from "@/lib/data/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Configuración general: horarios de apertura, seña y reset del demo. */
export function AdminSettings() {
  const base = COMPANY.venue;
  const [openHour, setOpenHour] = React.useState(base.openHour);
  const [closeHour, setCloseHour] = React.useState(base.closeHour);
  const [depositPct, setDepositPct] = React.useState(30);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const s = getAdminSettings();
    setOpenHour(s.openHour ?? base.openHour);
    setCloseHour(s.closeHour ?? base.closeHour);
    setDepositPct(s.depositPct);
  }, [base]);

  function save() {
    saveAdminSettings({
      openHour,
      closeHour: Math.max(closeHour, openHour + 1),
      depositPct,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function reset() {
    resetAdminSettings();
    setOpenHour(base.openHour);
    setCloseHour(base.closeHour);
    setDepositPct(30);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Horarios de atención</CardTitle>
          <CardDescription>
            Define qué turnos se ofrecen cada día en la web.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <label className="text-sm">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Apertura
            </span>
            <select
              value={openHour}
              onChange={(e) => setOpenHour(Number(e.target.value))}
              className="h-10 cursor-pointer rounded-xl border border-border bg-card px-3 text-sm font-medium outline-none"
            >
              {Array.from({ length: 12 }, (_, i) => i + 7).map((h) => (
                <option key={h} value={h}>
                  {h}:00
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Cierre
            </span>
            <select
              value={closeHour}
              onChange={(e) => setCloseHour(Number(e.target.value))}
              className="h-10 cursor-pointer rounded-xl border border-border bg-card px-3 text-sm font-medium outline-none"
            >
              {Array.from({ length: 10 }, (_, i) => i + 15).map((h) => (
                <option key={h} value={h}>
                  {h}:00
                </option>
              ))}
            </select>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seña online</CardTitle>
          <CardDescription>
            Porcentaje del precio que se cobra al reservar con seña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={depositPct}
              onChange={(e) => setDepositPct(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
              aria-label="Porcentaje de seña"
            />
            <span className="w-14 text-right text-xl font-bold">{depositPct}%</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {depositPct === 100
              ? "Se cobra el total al reservar."
              : `El cliente paga el ${depositPct}% online y el resto en el complejo.`}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
        <Button onClick={save}>
          {saved ? (
            <>
              <Check />
              Guardado
            </>
          ) : (
            "Guardar configuración"
          )}
        </Button>
        <Button variant="outline" onClick={reset}>
          <RotateCcw />
          Restablecer todo (demo)
        </Button>
        <p className="text-xs text-muted-foreground">
          “Restablecer” vuelve a los precios de lista y elimina bloqueos y
          configuración personalizada.
        </p>
      </div>
    </div>
  );
}
