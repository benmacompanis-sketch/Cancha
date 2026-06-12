import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVenue } from "@/lib/data/venues";
import { getSlotsForVenue } from "@/lib/data/availability";
import { addDays, toISODate } from "@/lib/utils";
import { BookingWizard } from "@/components/booking/wizard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const venue = getVenue(slug);
  return {
    title: venue ? `Reservar en ${venue.name}` : "Reservar",
    robots: { index: false },
  };
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cancha?: string; fecha?: string; hora?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const venue = getVenue(slug);
  if (!venue) notFound();

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i);
    return {
      iso: toISODate(d),
      label:
        i === 0
          ? "Hoy"
          : i === 1
            ? "Mañana"
            : new Intl.DateTimeFormat("es-AR", { weekday: "short", day: "numeric" }).format(d),
    };
  });
  const slots = dates.flatMap((d) => getSlotsForVenue(venue, d.iso));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Reservando en
      </p>
      <h1 className="mt-1 text-center text-2xl font-bold tracking-tight">
        {venue.name}
      </h1>
      <div className="mt-8">
        <BookingWizard
          venue={venue}
          dates={dates}
          slots={slots}
          initial={{
            fieldId: sp.cancha,
            date: sp.fecha,
            hour: sp.hora ? Number(sp.hora) : undefined,
          }}
        />
      </div>
    </div>
  );
}
