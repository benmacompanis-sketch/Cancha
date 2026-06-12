import type { Metadata } from "next";
import { venues } from "@/lib/data/venues";
import { getSlotsForVenue } from "@/lib/data/availability";
import { addDays, toISODate } from "@/lib/utils";
import { SearchClient } from "@/components/search/search-client";
import type { Slot } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Buscar canchas",
  description:
    "Encontrá canchas de fútbol 5, 6, 7, 8 y 11 con disponibilidad en tiempo real. Filtrá por barrio, fecha, hora, precio y servicios.",
  alternates: { canonical: "/buscar" },
};

export const dynamic = "force-dynamic";

export default function SearchPage() {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i);
    const label =
      i === 0
        ? "Hoy"
        : i === 1
          ? "Mañana"
          : new Intl.DateTimeFormat("es-AR", {
              weekday: "short",
              day: "numeric",
              month: "short",
            }).format(d);
    return { iso: toISODate(d), label };
  });

  const slotsByVenue: Record<string, Slot[]> = {};
  for (const venue of venues) {
    slotsByVenue[venue.slug] = dates.flatMap((d) =>
      getSlotsForVenue(venue, d.iso)
    );
  }

  return (
    <div className="pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Encontrá tu cancha
        </h1>
        <p className="mt-1 text-muted-foreground">
          Disponibilidad en tiempo real en {venues.length} complejos.
        </p>
      </div>
      <SearchClient venues={venues} dates={dates} slotsByVenue={slotsByVenue} />
    </div>
  );
}
