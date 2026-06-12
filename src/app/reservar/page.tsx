import type { Metadata } from "next";
import { Suspense } from "react";
import { COMPANY } from "@/lib/data/company";
import { BookingWizard } from "@/components/booking/wizard";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Reservar tu cancha",
  description:
    "Elegí cancha, día y horario, pagá online y recibí tu QR de acceso al instante.",
  alternates: { canonical: "/reservar" },
};

export default function BookingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Reservá tu cancha en
      </p>
      <h1 className="mt-1 text-center text-2xl font-bold tracking-tight">
        {COMPANY.name}
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
          <BookingWizard venue={COMPANY.venue} />
        </Suspense>
      </div>
    </div>
  );
}
