import type { Booking, PaymentKind, PaymentMethod } from "./types";

/**
 * Store de reservas en memoria para el modo demo.
 * En producción se reemplaza 1:1 por Prisma (ver src/lib/db.ts y
 * prisma/schema.prisma): la interfaz pública es idéntica.
 */
class BookingStore {
  private bookings = new Map<string, Booking>();

  isTaken(fieldId: string, date: string, hour: number) {
    for (const b of this.bookings.values()) {
      if (
        b.fieldId === fieldId &&
        b.date === date &&
        b.hour === hour &&
        b.status !== "cancelada"
      )
        return true;
    }
    return false;
  }

  create(input: {
    venueSlug: string;
    venueName: string;
    fieldId: string;
    fieldName: string;
    fieldType: Booking["fieldType"];
    date: string;
    hour: number;
    price: number;
    paymentMethod: PaymentMethod;
    paymentKind: PaymentKind;
    customerName: string;
    customerEmail: string;
  }): Booking {
    const id = crypto.randomUUID();
    const code = `CN-${id.slice(0, 4).toUpperCase()}${id.slice(9, 13).toUpperCase()}`;
    const booking: Booking = {
      ...input,
      id,
      code,
      paidAmount:
        input.paymentKind === "seña" ? Math.round(input.price * 0.3) : input.price,
      status: "confirmada",
      createdAt: new Date().toISOString(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  getByCode(code: string) {
    for (const b of this.bookings.values()) if (b.code === code) return b;
    return undefined;
  }

  list() {
    return [...this.bookings.values()];
  }

  cancel(id: string) {
    const b = this.bookings.get(id);
    if (b) b.status = "cancelada";
    return b;
  }
}

const globalForStore = globalThis as unknown as { __bookingStore?: BookingStore };
export const bookingStore = (globalForStore.__bookingStore ??= new BookingStore());
