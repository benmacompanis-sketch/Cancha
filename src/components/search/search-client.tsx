"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  CalendarDays,
  Clock,
} from "lucide-react";
import type { Slot, Venue } from "@/lib/data/types";
import { AMENITY_LABELS, FIELD_TYPE_LABELS } from "@/lib/data/venues";
import { getSlotsForVenue } from "@/lib/data/availability";
import { getUpcomingDates } from "@/lib/dates";
import { cn, formatARS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VenueCard } from "@/components/venue/venue-card";

const FIELD_TYPES = ["F5", "F6", "F7", "F8", "F11"] as const;
const ROOFS = [
  { id: "techada", label: "Techada" },
  { id: "descubierta", label: "Descubierta" },
] as const;
const SURFACES = [
  { id: "sintetico", label: "Césped sintético" },
  { id: "natural", label: "Césped natural" },
] as const;
const KEY_AMENITIES = ["estacionamiento", "buffet", "vestuarios"] as const;
const PRICE_MAXES = [
  { id: 0, label: "Cualquier precio" },
  { id: 30000, label: "Hasta $30.000" },
  { id: 45000, label: "Hasta $45.000" },
  { id: 60000, label: "Hasta $60.000" },
];

interface Props {
  venues: Venue[];
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-premium"
          : "border-border bg-card text-foreground hover:border-foreground/30"
      )}
    >
      {children}
    </button>
  );
}

export function SearchClient({ venues }: Props) {
  // Fechas y disponibilidad calculadas en el cliente para que el sitio
  // funcione en hosting estático sin quedar congelado a la fecha del build.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const dates = React.useMemo(() => getUpcomingDates(7), []);
  const slotsByVenue = React.useMemo(() => {
    const map: Record<string, Slot[]> = {};
    for (const venue of venues) {
      map[venue.slug] = dates.flatMap((d) => getSlotsForVenue(venue, d.iso));
    }
    return map;
  }, [venues, dates]);

  const [query, setQuery] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [date, setDate] = React.useState(dates[0].iso);
  const [hour, setHour] = React.useState<number | null>(null);
  const [types, setTypes] = React.useState<string[]>([]);
  const [roof, setRoof] = React.useState<string | null>(null);
  const [surface, setSurface] = React.useState<string | null>(null);
  const [amenities, setAmenities] = React.useState<string[]>([]);
  const [maxPrice, setMaxPrice] = React.useState(0);
  const [hovered, setHovered] = React.useState<string | null>(null);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const suggestions = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const names = venues
      .filter((v) => v.name.toLowerCase().includes(q))
      .map((v) => ({ type: "Complejo", value: v.name }));
    const hoods = [...new Set(venues.map((v) => v.neighborhood))]
      .filter((n) => n.toLowerCase().includes(q))
      .map((n) => ({ type: "Barrio", value: n }));
    const cities = [...new Set(venues.map((v) => v.city))]
      .filter((c) => c.toLowerCase().includes(q))
      .map((c) => ({ type: "Ciudad", value: c }));
    return [...hoods, ...cities, ...names].slice(0, 6);
  }, [query, venues]);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return venues
      .map((venue) => {
        const slots = (slotsByVenue[venue.slug] ?? []).filter(
          (s) => s.date === date && s.available
        );
        return { venue, slots };
      })
      .filter(({ venue, slots }) => {
        if (
          q &&
          ![venue.name, venue.neighborhood, venue.city]
            .join(" ")
            .toLowerCase()
            .includes(q)
        )
          return false;

        let fields = venue.fields;
        if (types.length) fields = fields.filter((f) => types.includes(f.type));
        if (roof) fields = fields.filter((f) => f.roof === roof);
        if (surface) fields = fields.filter((f) => f.surface === surface);
        if (maxPrice) fields = fields.filter((f) => f.pricePerHour <= maxPrice);
        if (!fields.length) return false;

        if (amenities.length && !amenities.every((a) => venue.amenities.includes(a as never)))
          return false;

        const fieldIds = new Set(fields.map((f) => f.id));
        const matching = slots.filter(
          (s) => fieldIds.has(s.fieldId) && (hour === null || s.hour === hour)
        );
        return matching.length > 0;
      })
      .map(({ venue, slots }) => ({
        venue,
        available: slots.filter((s) => hour === null || s.hour === hour).length,
      }));
  }, [venues, slotsByVenue, query, date, hour, types, roof, surface, amenities, maxPrice]);

  const activeFilters =
    types.length +
    amenities.length +
    (roof ? 1 : 0) +
    (surface ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (hour !== null ? 1 : 0);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mx-auto mt-3 max-w-3xl">
          <Skeleton className="h-14 w-full rounded-full" />
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      {/* ── Barra de búsqueda estilo Airbnb ── */}
      <div className="sticky top-16 z-40 -mx-4 px-4 py-3 sm:-mx-6 sm:px-6">
        <div className="glass mx-auto flex max-w-3xl flex-col gap-2 rounded-2xl p-2 shadow-premium-lg sm:flex-row sm:items-center sm:rounded-full">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
              placeholder="Buscá por barrio, ciudad o complejo…"
              className="h-11 w-full rounded-full bg-transparent pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground"
            />
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="glass absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl shadow-premium-lg"
                >
                  {suggestions.map((s) => (
                    <li key={`${s.type}-${s.value}`}>
                      <button
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-muted"
                        onMouseDown={() => {
                          setQuery(s.value);
                          setShowSuggestions(false);
                        }}
                      >
                        <MapPin className="size-4 text-muted-foreground" />
                        <span className="flex-1">{s.value}</span>
                        <span className="text-xs text-muted-foreground">{s.type}</span>
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 px-1">
            <div className="hidden h-6 w-px bg-border sm:block" />
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 cursor-pointer bg-transparent text-sm font-medium outline-none"
              aria-label="Fecha"
            >
              {dates.map((d) => (
                <option key={d.iso} value={d.iso}>
                  {d.label}
                </option>
              ))}
            </select>

            <div className="hidden h-6 w-px bg-border sm:block" />
            <Clock className="size-4 shrink-0 text-muted-foreground" />
            <select
              value={hour ?? ""}
              onChange={(e) => setHour(e.target.value === "" ? null : Number(e.target.value))}
              className="h-11 cursor-pointer bg-transparent text-sm font-medium outline-none"
              aria-label="Hora"
            >
              <option value="">Cualquier hora</option>
              {Array.from({ length: 15 }, (_, i) => i + 9).map((h) => (
                <option key={h} value={h}>
                  {h}:00
                </option>
              ))}
            </select>

            <Button
              variant={activeFilters ? "default" : "outline"}
              size="sm"
              className="ml-auto rounded-full"
              onClick={() => setShowFilters((v) => !v)}
            >
              <SlidersHorizontal />
              Filtros
              {activeFilters > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
                  {activeFilters}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Panel de filtros ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-2xl border border-border bg-card p-5 shadow-premium">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filtros</h3>
                <button
                  onClick={() => {
                    setTypes([]);
                    setRoof(null);
                    setSurface(null);
                    setAmenities([]);
                    setMaxPrice(0);
                    setHour(null);
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Limpiar todo
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tipo de cancha
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {FIELD_TYPES.map((t) => (
                      <Chip key={t} active={types.includes(t)} onClick={() => toggle(types, setTypes, t)}>
                        {FIELD_TYPE_LABELS[t]}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Techo
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ROOFS.map((r) => (
                        <Chip key={r.id} active={roof === r.id} onClick={() => setRoof(roof === r.id ? null : r.id)}>
                          {r.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Superficie
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SURFACES.map((s) => (
                        <Chip key={s.id} active={surface === s.id} onClick={() => setSurface(surface === s.id ? null : s.id)}>
                          {s.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Servicios
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {KEY_AMENITIES.map((a) => (
                        <Chip key={a} active={amenities.includes(a)} onClick={() => toggle(amenities, setAmenities, a)}>
                          {AMENITY_LABELS[a]}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Precio por hora
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PRICE_MAXES.map((p) => (
                        <Chip key={p.id} active={maxPrice === p.id} onClick={() => setMaxPrice(p.id)}>
                          {p.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Resultados + mapa ── */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            <span className="font-semibold text-foreground">{results.length}</span>{" "}
            {results.length === 1 ? "complejo disponible" : "complejos disponibles"}
            {hour !== null && ` a las ${hour}:00`}
          </p>

          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {results.map(({ venue, available }) => (
                <motion.div
                  key={venue.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  onMouseEnter={() => setHovered(venue.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <VenueCard venue={venue} availableToday={available} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {results.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="font-semibold">No encontramos canchas con esos filtros</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Probá con otra fecha, horario o quitando algún filtro.
              </p>
            </div>
          )}
        </div>

        {/* ── Mapa interactivo ── */}
        <div className="sticky top-36 hidden h-[560px] overflow-hidden rounded-2xl border border-border shadow-premium lg:block">
          <div className="relative h-full w-full bg-muted">
            {/* calles estilizadas */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.35]" aria-hidden>
              <defs>
                <pattern id="streets" width="64" height="64" patternUnits="userSpaceOnUse">
                  <path d="M0 32h64M32 0v64" stroke="var(--border)" strokeWidth="3" />
                  <path d="M0 8h64M0 52h64M12 0v64M50 0v64" stroke="var(--border)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#streets)" />
              <path
                d="M-20 110 C 120 60, 240 180, 420 120"
                stroke="var(--primary)"
                strokeOpacity="0.25"
                strokeWidth="22"
                fill="none"
              />
            </svg>

            <div className="glass absolute left-3 top-3 z-10 rounded-lg px-3 py-1.5 text-xs font-medium">
              Buenos Aires y alrededores
            </div>

            {results.map(({ venue }) => {
              const minPrice = Math.min(...venue.fields.map((f) => f.pricePerHour));
              const active = hovered === venue.id;
              return (
                <motion.a
                  key={venue.id}
                  href={`/complejos/${venue.slug}`}
                  className={cn(
                    "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-xs font-bold shadow-premium transition-colors",
                    active
                      ? "z-20 border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground"
                  )}
                  style={{ left: `${venue.mapX}%`, top: `${venue.mapY}%` }}
                  animate={{ scale: active ? 1.18 : 1 }}
                  onMouseEnter={() => setHovered(venue.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {formatARS(minPrice)}
                  {active && (
                    <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-[10px] font-medium text-background">
                      {venue.name} · ★ {venue.rating}
                    </span>
                  )}
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>

      {/* chips de filtros activos (mobile-friendly) */}
      {activeFilters > 0 && (
        <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 lg:hidden">
          <button
            onClick={() => setShowFilters(true)}
            className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-premium-lg"
          >
            <Badge>{activeFilters}</Badge> filtros activos
            <X
              className="size-4"
              onClick={(e) => {
                e.stopPropagation();
                setTypes([]);
                setRoof(null);
                setSurface(null);
                setAmenities([]);
                setMaxPrice(0);
                setHour(null);
              }}
            />
          </button>
        </div>
      )}
    </div>
  );
}
