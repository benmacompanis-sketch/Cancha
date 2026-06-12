import type { Metadata } from "next";
import { Suspense } from "react";
import { Confirmation } from "@/components/booking/confirmation";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Reserva confirmada",
  robots: { index: false },
};

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg space-y-4 px-4 py-12">
          <Skeleton className="mx-auto size-16 rounded-full" />
          <Skeleton className="h-80 w-full rounded-3xl" />
        </div>
      }
    >
      <Confirmation />
    </Suspense>
  );
}
