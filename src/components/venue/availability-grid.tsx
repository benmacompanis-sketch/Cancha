"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Venue } from "@/lib/data/types";
import { FIELD_TYPE_LABELS } from "@/lib/data/venues";
import { getSlotsForVenue } from "@/lib/data/availability";
import { applyBlockedSlots, getEffectiveVenue } from "@/lib/data/admin-store";
import { getUpcomingDates } from "@/lib/dates";
import { cn, formatARS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  venue: Venue;
}

export function AvailabilityGrid({ venue: baseVenue }: Props) {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Calculado en el cliente: funciona en hosting estático, refleja la
  // fecha actual del visitante y aplica la configuración del panel de
  // admin (precios, canchas activas, horarios y turnos bloqueados).
  const venue = React.useMemo(
    () => (mounted ? getEffectiveVenue(baseVenue) : baseVenue),
    [baseVenue, mounted]
  );
  const dates = React.useMemo(() => getUpcomingDates(7), []);
  const slots = React.useMemo(
    () =>
      applyBlockedSlots(dates.flatMap((d) => getSlotsForVenue(venue, d.iso))),
    [venue, dates]
  );

  const [date, setDate] = React.useState(dates[0].iso);
  const [fieldId, setFieldId] = React.useState(venue.fields[0]?.id ?? "");

  React.useEffect(() => {
    if (mounted && !venue.fields.some((f) => f.id === fieldId)) {
      setFieldId(venue.fields[0]?.id ?? "");
    }
  }, [mounted, venue, fieldId]);

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-premium">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-4 h-10 w-full" />
        <Skeleton className="mt-3 h-14 w-full" />
        <Skeleton className="mt-4 h-48 w-full" />
      </div>
    );
  }

  const field = venue.fields.find((f) => f.id === fieldId) ?? venue.fields[0];
  const daySlots = slots
    .filter((s) => s.date === date && s.fieldId === fieldId)
    .sort((a, b) => a.hour - b.hour);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-premium">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">Disponibilidad</h3>
        <Badge variant="live">
          <span className="relative flex size-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative size-1.5 rounded-full bg-primary" />
          </span>
          En tiempo real
        </Badge>
      </div>

      {/* selector de fecha */}
      <div className="scrollbar-thin mt-4 flex gap-2 overflow-x-auto pb-1">
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

      {/* selector de cancha */}
      <div className="scrollbar-thin mt-3 flex gap-2 overflow-x-auto pb-1">
        {venue.fields.map((f) => (
          <button
            key={f.id}
            onClick={() => setFieldId(f.id)}
            className={cn(
              "shrink-0 rounded-xl border px-3.5 py-2 text-left transition-all active:scale-95",
              fieldId === f.id
                ? "border-primary bg-primary-soft"
                : "border-border bg-card hover:border-foreground/30"
            )}
          >
            <p className="text-sm font-semibold">{f.name}</p>
            <p className="text-xs text-muted-foreground">
              {FIELD_TYPE_LABELS[f.type]} ·{" "}
              {f.roof === "techada" ? "Techada" : "Descubierta"}
            </p>
          </button>
        ))}
      </div>

      {/* grilla de horarios */}
      <motion.div
        key={`${date}-${fieldId}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4"
      >
        {daySlots.map((s) => (
          <button
            key={s.hour}
            disabled={!s.available}
            onClick={() =>
              router.push(
                `/reservar?cancha=${fieldId}&fecha=${date}&hora=${s.hour}`
              )
            }
            className={cn(
              "rounded-xl border px-2 py-2.5 text-center transition-all",
              s.available
                ? "border-border bg-card hover:border-primary hover:bg-primary-soft active:scale-95"
                : "cursor-not-allowed border-transparent bg-muted opacity-45"
            )}
          >
            <p className={cn("text-sm font-semibold", !s.available && "line-through")}>
              {s.hour}:00
            </p>
            <p className="text-[11px] text-muted-foreground">
              {s.available ? formatARS(s.price) : "Ocupado"}
            </p>
          </button>
        ))}
      </motion.div>

      <p className="mt-4 text-xs text-muted-foreground">
        {field?.name} · {field ? FIELD_TYPE_LABELS[field.type] : ""} · Seleccioná un horario
        para reservar al instante.
      </p>
    </div>
  );
}
