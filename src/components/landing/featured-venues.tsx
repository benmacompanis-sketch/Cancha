import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { venues } from "@/lib/data/venues";
import { getAvailableCount } from "@/lib/data/availability";
import { toISODate } from "@/lib/utils";
import { VenueCard } from "@/components/venue/venue-card";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";

export function FeaturedVenues() {
  const today = toISODate(new Date());
  const featured = venues.filter((v) => v.featured);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:pb-28">
      <FadeIn className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Complejos destacados
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Los mejor valorados por la comunidad, con turnos libres hoy.
          </p>
        </div>
        <Link href="/buscar">
          <Button variant="outline">
            Ver todos
            <ArrowRight />
          </Button>
        </Link>
      </FadeIn>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((v, i) => (
          <FadeIn key={v.id} delay={i}>
            <VenueCard venue={v} availableToday={getAvailableCount(v, today)} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
