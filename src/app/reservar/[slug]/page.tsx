import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { venues, getVenue } from "@/lib/data/venues";
import { BookingWizard } from "@/components/booking/wizard";
import { Skeleton } from "@/components/ui/skeleton";

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
  return {
    title: venue ? `Reservar en ${venue.name}` : "Reservar",
    robots: { index: false },
  };
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenue(slug);
  if (!venue) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Reservando en
      </p>
      <h1 className="mt-1 text-center text-2xl font-bold tracking-tight">
        {venue.name}
      </h1>
      <div className="mt-8">
        <Suspense
          fallback={
            <div className="mx-auto max-w-2xl space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-72 w-full" />
            </div>
          }
        >
          <BookingWizard venue={venue} />
        </Suspense>
      </div>
    </div>
  );
}
