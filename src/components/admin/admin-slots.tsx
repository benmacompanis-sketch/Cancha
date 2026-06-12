"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { COMPANY } from "@/lib/data/company";
import { FIELD_TYPE_LABELS } from "@/lib/data/venues";
import { getSlotsForVenue } from "@/lib/data/availability";
import {
  applySlotOverrides,
  getEffectiveVenue,
  setSlotState,
} from "@/lib/data/admin-store";
import { applyClientBookings } from "@/lib/data/client-store";
import { getUpcomingDates } from "@/lib/dates";
import { cn } from "@/lib/utils";

/**
 * Gestión de turnos simplificada: cada celda alterna entre
 * DISPONIBLE y OCUPADO con un clic, sin importar su estado original.
 */
export function AdminSlots() {
  const dates = React.useMemo(() => getUpcomingDates(7), []);
  const [date, setDate] = React.useState(dates[0].iso);
  // tick fuerza recálculo tras cada cambio
  const [tick, setTick] = React.useState(0);

  const grid = React.useMemo(() => {
    const venue = getEffectiveVenue(COMPANY.venue);
    const slots = applyClientBookings(
      applySlotOverrides(getSlotsForVenue(venue, date))
    );
    return venue.fields.map((field) => ({
      field,
      hours: slots
        .filter((s) => s.fieldId === field.id)
        .sort((a, b) => a.hour - b.hour),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, tick]);

  const totals = React.useMemo(() => {
    const all = grid.flatMap((g) => g.hours);
    const free = all.filter((s) => s.available).length;
    return { free, taken: all.length - free };
  }, [grid]);

  function toggle(fieldId: string, hour: number, available: boolean) {
    setSlotState(fieldId, date, hour, available ? "ocupado" : "libre");
    setTick((t) => t + 1);
  }

  return (
    <div className="space-y-4">
      <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
        {dates.map((d) => (
          <button
            key={d.iso}
            onClick={() => setDate(d.iso)}
            className={cn(
              "shrink-0 rounded-xl border px-3.5 py-2 text-sm font-medium capitalize transition-all active:scale-95",
              date === d.iso
                ? "border-primary bg-primary text-primary-foreground shadow-premium"
                : "border-border bg-card hover:border-foreground/30"
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <p className="flex items-center gap-1.5 text-muted-foreground">
          <Info className="size-4 shrink-0 text-primary" />
          Tocá un turno para cambiarlo entre disponible y ocupado.
        </p>
        <p className="ml-auto text-xs text-muted-foreground">
          <span className="font-semibold text-primary">{totals.free} disponibles</span>
          {" · "}
          <span className="font-semibold text-foreground">{totals.taken} ocupados</span>
        </p>
      </div>

      {grid.map(({ field, hours }) => (
        <div
          key={field.id}
          className="rounded-2xl border border-border bg-card p-4 shadow-premium"
        >
          <p className="font-semibold">
            {field.name}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              · {FIELD_TYPE_LABELS[field.type]}
            </span>
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {hours.map((s) => (
              <button
                key={s.hour}
                onClick={() => toggle(field.id, s.hour, s.available)}
                title={s.available ? "Marcar ocupado" : "Marcar disponible"}
                className={cn(
                  "rounded-lg border px-1 py-2.5 text-center transition-all active:scale-95",
                  s.available
                    ? "border-primary/40 bg-primary-soft hover:border-primary"
                    : "border-transparent bg-red-500/15 hover:border-red-400"
                )}
              >
                <span
                  className={cn(
                    "block text-sm font-bold",
                    s.available ? "text-primary" : "text-red-600 dark:text-red-400"
                  )}
                >
                  {s.hour}h
                </span>
                <span
                  className={cn(
                    "block text-[10px] font-medium",
                    s.available
                      ? "text-primary/70"
                      : "text-red-600/70 dark:text-red-400/70"
                  )}
                >
                  {s.available ? "Disponible" : "Ocupado"}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
