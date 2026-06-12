"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Slot, Venue } from "@/lib/data/types";
import { FIELD_TYPE_LABELS } from "@/lib/data/venues";
import { cn, formatARS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Props {
  venue: Venue;
  dates: { iso: string; label: string }[];
  slots: Slot[];
}

export function AvailabilityGrid({ venue, dates, slots }: Props) {
  const router = useRouter();
  const [date, setDate] = React.useState(dates[0].iso);
  const [fieldId, setFieldId] = React.useState(venue.fields[0].id);

  const field = venue.fields.find((f) => f.id === fieldId)!;
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
                `/reservar/${venue.slug}?cancha=${fieldId}&fecha=${date}&hora=${s.hour}`
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
        {field.name} · {FIELD_TYPE_LABELS[field.type]} · Seleccioná un horario
        para reservar al instante.
      </p>
    </div>
  );
}
