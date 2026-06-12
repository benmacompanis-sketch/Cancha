import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Check, Clock, Download, MapPin, Share2 } from "lucide-react";
import QRCode from "react-qr-code";
import { bookingStore } from "@/lib/data/bookings";
import { getVenue } from "@/lib/data/venues";
import { formatARS, formatDateLong } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reserva confirmada",
  robots: { index: false },
};

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const booking = bookingStore.getByCode(code);
  if (!booking) notFound();

  const venue = getVenue(booking.venueSlug);
  const remaining = booking.price - booking.paidAmount;

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-premium-lg">
          <Check className="size-8" strokeWidth={3} />
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">
          ¡Reserva confirmada!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Te enviamos el comprobante por email y WhatsApp.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-premium-lg">
        <div className="border-b border-dashed border-border p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">{booking.venueName}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {venue?.address}
              </p>
            </div>
            <Badge variant="success">Confirmada</Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-muted p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" /> Fecha
              </p>
              <p className="mt-1 font-semibold capitalize">
                {formatDateLong(new Date(booking.date + "T12:00:00"))}
              </p>
            </div>
            <div className="rounded-xl bg-muted p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> Horario
              </p>
              <p className="mt-1 font-semibold">
                {booking.hour}:00 – {booking.hour + 1}:00 hs
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-muted p-3 text-sm">
            <span className="text-muted-foreground">{booking.fieldName}</span>
            <span className="font-semibold">{formatARS(booking.price)}</span>
          </div>
          {remaining > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Pagaste {formatARS(booking.paidAmount)} de seña · Restan{" "}
              {formatARS(remaining)} a abonar en el complejo.
            </p>
          )}
        </div>

        <div className="flex flex-col items-center p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Tu QR de acceso
          </p>
          <div className="mt-3 rounded-2xl bg-white p-4 shadow-premium">
            <QRCode
              value={`https://cancha.app/checkin/${booking.code}`}
              size={160}
              fgColor="#09090b"
            />
          </div>
          <p className="mt-3 font-mono text-lg font-bold tracking-[0.25em]">
            {booking.code}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Mostralo al llegar al complejo
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="outline">
          <Download />
          Comprobante
        </Button>
        <Button variant="outline">
          <Share2 />
          Invitar equipo
        </Button>
      </div>

      <div className="mt-3">
        <Link href="/dashboard">
          <Button className="w-full" size="lg">
            Ver mis partidos
          </Button>
        </Link>
      </div>
    </div>
  );
}
