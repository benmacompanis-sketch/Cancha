import type { Metadata } from "next";
import { venues } from "@/lib/data/venues";
import { SearchClient } from "@/components/search/search-client";

export const metadata: Metadata = {
  title: "Buscar canchas",
  description:
    "Encontrá canchas de fútbol 5, 6, 7, 8 y 11 con disponibilidad en tiempo real. Filtrá por barrio, fecha, hora, precio y servicios.",
  alternates: { canonical: "/buscar" },
};

export default function SearchPage() {
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
      <SearchClient venues={venues} />
    </div>
  );
}
