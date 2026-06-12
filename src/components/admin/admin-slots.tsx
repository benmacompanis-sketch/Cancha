"use client";

import * as React from "react";
import { Ban, Info } from "lucide-react";
import { COMPANY } from "@/lib/data/company";
import { FIELD_TYPE_LABELS } from "@/lib/data/venues";
import { getSlotsForVenue } from "@/lib/data/availability";
import {
  getAdminSettings,
  getEffectiveVenue,
  toggleSlotBlock,
} from "@/lib/data/admin-store";
import { getClientBookings } from "@/lib/data/client-store";
import { getUpcomingDates } from "@/lib/dates";
import { cn } from "@/lib/utils";

type CellState = "libre" | "bloqueado" | "reservado";

/** Gestión de turnos: bloquear/desbloquear horarios de los próximos 7 días. */
export function AdminSlots() {
  const dates = React.useMemo(() => getUpcomingDates(7), []);
  const [date, setDate] = React.useState(dates[0].iso);
  // tick fuerza recálculo tras cada bloqueo/desbloqueo
  const [tick, setTick] = React.useState(0);

  const venue = React.useMemo(() => getEffectiveVenue(COMPANY.venue), []);

  const grid = React.useMemo(() => {
    const blocked = new Set(getAdminSettings().blockedSlots);
    const clientTaken = new Set(
      getClientBookings()
        .filter((b) => b.status !== "cancelada")
        .map((b) => `${b.fieldId}|${b.date}|${b.hour}`)
    );
    const slots = getSlotsForVenue(venue, date);
    return venue.fields.map((field) => ({
      field,
      hours: slots
        .filter((s) => s.fieldId === field.id)
        .sort((a, b) => a.hour - b.hour)
        .map((s) => {
          const key = `${field.id}|${date}|${s.hour}`;
          const state: CellState = blocked.has(key)
            ? "bloqueado"
            : !s.available || clientTaken.has(key)
              ? "reservado"
              : "libre";
          return { hour: s.hour, state };
        }),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venue, date, tick]);

  function toggle(fieldId: string, hour: number, state: CellState) {
    if (state === "reservado") return;
    toggleSlotBlock(fieldId, date, hour);
    setTick((t) => t + 1);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
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
        <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded border border-border bg-card" /> Libre
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-red-500/70" /> Bloqueado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-muted" /> Reservado
          </span>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Info className="size-4 shrink-0 text-primary" />
        Hacé clic en un turno libre para bloquearlo (mantenimiento, torneo,
        uso interno). Los bloqueados dejan de ofrecerse al instante en la web.
      </p>

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
            {hours.map(({ hour, state }) => (
              <button
                key={hour}
                onClick={() => toggle(field.id, hour, state)}
                disabled={state === "reservado"}
                title={
                  state === "reservado"
                    ? "Turno reservado"
                    : state === "bloqueado"
                      ? "Clic para desbloquear"
                      : "Clic para bloquear"
                }
                className={cn(
                  "rounded-lg border px-1 py-2 text-center text-sm font-semibold transition-all",
                  state === "libre" &&
                    "border-border bg-card hover:border-red-400 hover:bg-red-500/10 active:scale-95",
                  state === "bloqueado" &&
                    "border-red-500/60 bg-red-500/70 text-white active:scale-95",
                  state === "reservado" &&
                    "cursor-not-allowed border-transparent bg-muted text-muted-foreground line-through opacity-60"
                )}
              >
                {state === "bloqueado" ? (
                  <span className="flex items-center justify-center gap-1">
                    <Ban className="size-3" />
                    {hour}h
                  </span>
                ) : (
                  `${hour}h`
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
