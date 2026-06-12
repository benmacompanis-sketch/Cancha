"use server";

import { getVenue } from "@/lib/data/venues";
import { getSlotsForVenue } from "@/lib/data/availability";
import { bookingStore } from "@/lib/data/bookings";
import { createPreference, sendConfirmations } from "@/lib/payments/mercadopago";
import type { PaymentKind, PaymentMethod } from "@/lib/data/types";

export interface CreateBookingInput {
  venueSlug: string;
  fieldId: string;
  date: string;
  hour: number;
  paymentMethod: PaymentMethod;
  paymentKind: PaymentKind;
  customerName: string;
  customerEmail: string;
}

export async function createBooking(input: CreateBookingInput) {
  const venue = getVenue(input.venueSlug);
  if (!venue) return { error: "Complejo no encontrado" as const };

  const field = venue.fields.find((f) => f.id === input.fieldId);
  if (!field) return { error: "Cancha no encontrada" as const };

  const slot = getSlotsForVenue(venue, input.date).find(
    (s) => s.fieldId === input.fieldId && s.hour === input.hour
  );
  if (!slot?.available) {
    return { error: "Ese turno acaba de ocuparse. Elegí otro horario." as const };
  }

  if (!input.customerName.trim() || !/.+@.+\..+/.test(input.customerEmail)) {
    return { error: "Completá tu nombre y un email válido." as const };
  }

  const booking = bookingStore.create({
    venueSlug: venue.slug,
    venueName: venue.name,
    fieldId: field.id,
    fieldName: field.name,
    fieldType: field.type,
    date: input.date,
    hour: input.hour,
    price: slot.price,
    paymentMethod: input.paymentMethod,
    paymentKind: input.paymentKind,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim(),
  });

  // Pago online (Checkout Pro en producción, aprobado al instante en demo)
  await createPreference({
    code: booking.code,
    title: `${venue.name} · ${field.name} · ${input.date} ${input.hour}:00`,
    amount: booking.paidAmount,
    payerEmail: booking.customerEmail,
  });

  // Confirmaciones automáticas (email + WhatsApp)
  await sendConfirmations(booking);

  return { code: booking.code };
}
