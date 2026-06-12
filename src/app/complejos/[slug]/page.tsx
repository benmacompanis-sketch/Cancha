import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  MapPin,
  Star,
  Clock,
  Car,
  UtensilsCrossed,
  ShowerHead,
  Wifi,
  Flame,
  Lightbulb,
  Store,
  Droplets,
  PlayCircle,
} from "lucide-react";
import { venues, getVenue, AMENITY_LABELS, FIELD_TYPE_LABELS } from "@/lib/data/venues";
import { formatARS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FieldVisual } from "@/components/venue/field-visual";
import { AvailabilityGrid } from "@/components/venue/availability-grid";
import { FadeIn } from "@/components/motion";

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  estacionamiento: Car,
  buffet: UtensilsCrossed,
  vestuarios: ShowerHead,
  wifi: Wifi,
  parrilla: Flame,
  "iluminacion-led": Lightbulb,
  kiosco: Store,
  duchas: Droplets,
};

export function generateStaticParams() {
  return venues.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const venue = getVenue(slug);
  if (!venue) return {};
  return {
    title: `${venue.name} — ${venue.neighborhood}`,
    description: `Reservá online en ${venue.name} (${venue.address}). ${venue.fields.length} canchas con disponibilidad en tiempo real. ★ ${venue.rating} (${venue.reviewCount} opiniones).`,
    alternates: { canonical: `/complejos/${venue.slug}` },
    openGraph: {
      title: `${venue.name} · Cancha`,
      description: venue.description.slice(0, 160),
    },
  };
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenue(slug);
  if (!venue) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: venue.name,
    description: venue.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: venue.address,
      addressLocality: venue.city,
      addressCountry: "AR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: venue.rating,
      reviewCount: venue.reviewCount,
    },
    priceRange: "$$",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Encabezado ── */}
      <FadeIn>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {venue.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {venue.rating}
                <span className="font-normal text-muted-foreground">
                  ({venue.reviewCount} opiniones)
                </span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-4" />
                {venue.address}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-4" />
                {venue.openHour}:00 – {venue.closeHour}:00 hs
              </span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Galería ── */}
      <FadeIn delay={1}>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <FieldVisual
            hue={venue.fields[0].hue}
            className="col-span-2 row-span-2 aspect-[4/3] rounded-2xl md:aspect-auto"
            label={venue.fields[0].name}
          />
          {venue.fields.slice(1, 4).map((f) => (
            <FieldVisual
              key={f.id}
              hue={f.hue}
              className="aspect-[4/3] rounded-2xl"
              label={f.name}
            />
          ))}
          <div className="relative flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
            <div className="text-center">
              <PlayCircle className="mx-auto size-8" />
              <p className="mt-1 text-xs font-medium">Ver video del complejo</p>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-10">
          {/* ── Descripción ── */}
          <FadeIn>
            <section>
              <h2 className="text-xl font-semibold">Sobre el complejo</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {venue.description}
              </p>
            </section>
          </FadeIn>

          {/* ── Canchas ── */}
          <FadeIn>
            <section>
              <h2 className="text-xl font-semibold">Canchas</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {venue.fields.map((f) => (
                  <div
                    key={f.id}
                    className="overflow-hidden rounded-2xl border border-border bg-card shadow-premium"
                  >
                    <FieldVisual hue={f.hue} className="aspect-[16/7]" />
                    <div className="p-4">
                      <p className="font-semibold">{f.name}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge variant="secondary">{FIELD_TYPE_LABELS[f.type]}</Badge>
                        <Badge variant="secondary">
                          {f.roof === "techada" ? "Techada" : "Descubierta"}
                        </Badge>
                        <Badge variant="secondary">
                          {f.surface === "sintetico" ? "Sintético" : "Natural"}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        <span className="text-base font-bold text-foreground">
                          {formatARS(f.pricePerHour)}
                        </span>{" "}
                        / hora
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>

          {/* ── Servicios ── */}
          <FadeIn>
            <section>
              <h2 className="text-xl font-semibold">Servicios</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {venue.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a] ?? Store;
                  return (
                    <div
                      key={a}
                      className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3 text-sm font-medium"
                    >
                      <Icon className="size-4 text-primary" />
                      {AMENITY_LABELS[a]}
                    </div>
                  );
                })}
              </div>
            </section>
          </FadeIn>

          {/* ── Ubicación ── */}
          <FadeIn>
            <section>
              <h2 className="text-xl font-semibold">Ubicación</h2>
              <div className="relative mt-4 h-56 overflow-hidden rounded-2xl border border-border bg-muted">
                <svg className="absolute inset-0 h-full w-full opacity-[0.35]" aria-hidden>
                  <defs>
                    <pattern id="streets-mini" width="48" height="48" patternUnits="userSpaceOnUse">
                      <path d="M0 24h48M24 0v48" stroke="var(--border)" strokeWidth="2.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#streets-mini)" />
                </svg>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="relative flex">
                    <span className="absolute inline-flex size-10 -translate-x-1/4 -translate-y-1/4 animate-ping rounded-full bg-primary/30" />
                    <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-premium-lg">
                      <MapPin className="size-4" />
                    </span>
                  </span>
                </div>
                <div className="glass absolute bottom-3 left-3 rounded-lg px-3 py-1.5 text-xs font-medium">
                  {venue.address}
                </div>
              </div>
            </section>
          </FadeIn>

          {/* ── Opiniones ── */}
          <FadeIn>
            <section>
              <h2 className="text-xl font-semibold">
                Opiniones{" "}
                <span className="text-base font-normal text-muted-foreground">
                  · ★ {venue.rating} ({venue.reviewCount})
                </span>
              </h2>
              <div className="mt-4 space-y-4">
                {venue.reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-premium"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                          {r.author[0]}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{r.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Intl.DateTimeFormat("es-AR", {
                              day: "numeric",
                              month: "long",
                            }).format(new Date(r.date + "T12:00:00"))}
                          </p>
                        </div>
                      </div>
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3.5 ${
                              i < r.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-border"
                            }`}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        </div>

        {/* ── Panel de reserva (sticky) ── */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <AvailabilityGrid venue={venue} />
        </div>
      </div>
    </div>
  );
}
