"use client";

import type { Booking, PaymentKind, PaymentMethod } from "./types";
import { getVenue } from "./venues";
import { getSlotsForVenue } from "./availability";

/**
 * Store de reservas del lado del cliente (localStorage).
 * Permite que el flujo completo funcione en hosting estático
 * (GitHub Pages). En producción se reemplaza por Server Actions +
 * Prisma manteniendo el mismo contrato.
 */
const KEY = "cancha.bookings.v1";

export function getClientBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Booking[];
  } catch {
    return [];
  }
}

function save(bookings: Booking[]) {
  window.localStorage.setItem(KEY, JSON.stringify(bookings));
}

export function getClientBookingByCode(code: string) {
  return getClientBookings().find((b) => b.code === code);
}

function isClientTaken(fieldId: string, date: string, hour: number) {
  return getClientBookings().some(
    (b) =>
      b.fieldId === fieldId &&
      b.date === date &&
      b.hour === hour &&
      b.status !== "cancelada"
  );
}

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

export function createClientBooking(
  input: CreateBookingInput
): { code: string } | { error: string } {
  const venue = getVenue(input.venueSlug);
  if (!venue) return { error: "Complejo no encontrado" };

  const field = venue.fields.find((f) => f.id === input.fieldId);
  if (!field) return { error: "Cancha no encontrada" };

  const slot = getSlotsForVenue(venue, input.date).find(
    (s) => s.fieldId === input.fieldId && s.hour === input.hour
  );
  if (!slot?.available || isClientTaken(input.fieldId, input.date, input.hour)) {
    return { error: "Ese turno acaba de ocuparse. Elegí otro horario." };
  }

  if (!input.customerName.trim() || !/.+@.+\..+/.test(input.customerEmail)) {
    return { error: "Completá tu nombre y un email válido." };
  }

  const id = crypto.randomUUID();
  const code = `CN-${id.slice(0, 4).toUpperCase()}${id.slice(9, 13).toUpperCase()}`;
  const booking: Booking = {
    id,
    code,
    venueSlug: venue.slug,
    venueName: venue.name,
    fieldId: field.id,
    fieldName: field.name,
    fieldType: field.type,
    date: input.date,
    hour: input.hour,
    price: slot.price,
    paidAmount:
      input.paymentKind === "seña" ? Math.round(slot.price * 0.3) : slot.price,
    paymentMethod: input.paymentMethod,
    paymentKind: input.paymentKind,
    status: "confirmada",
    createdAt: new Date().toISOString(),
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim(),
  };

  save([...getClientBookings(), booking]);
  return { code };
}
