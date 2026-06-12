import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { Venue } from "@/lib/data/types";
import { FIELD_TYPE_LABELS } from "@/lib/data/venues";
import { formatARS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FieldVisual } from "./field-visual";

export function VenueCard({
  venue,
  availableToday,
}: {
  venue: Venue;
  availableToday?: number;
}) {
  const minPrice = Math.min(...venue.fields.map((f) => f.pricePerHour));
  const types = [...new Set(venue.fields.map((f) => f.type))];

  return (
    <Link
      href={`/complejos/${venue.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg"
    >
      <div className="relative">
        <FieldVisual
          hue={venue.fields[0].hue}
          className="aspect-[16/9] transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {typeof availableToday === "number" && availableToday > 0 && (
          <Badge className="glass absolute left-3 top-3 border-0 text-white">
            <span className="relative flex size-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative size-1.5 rounded-full bg-emerald-300" />
            </span>
            {availableToday} turnos hoy
          </Badge>
        )}
        {venue.featured && (
          <Badge variant="warning" className="absolute right-3 top-3 bg-amber-400/90 text-amber-950">
            Destacado
          </Badge>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{venue.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {venue.neighborhood}, {venue.city}
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {venue.rating}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {types.map((t) => (
            <Badge key={t} variant="secondary">
              {FIELD_TYPE_LABELS[t]}
            </Badge>
          ))}
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          Desde{" "}
          <span className="text-base font-bold text-foreground">
            {formatARS(minPrice)}
          </span>{" "}
          / hora
        </p>
      </div>
    </Link>
  );
}
