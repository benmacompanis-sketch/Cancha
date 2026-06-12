import type { Slot, Venue } from "./types";
import { bookingStore } from "./bookings";

/**
 * Disponibilidad determinística pseudo-aleatoria por (cancha, fecha, hora).
 * En producción esto se resuelve con una query a la tabla `Booking`
 * (ver prisma/schema.prisma); acá simula ocupación realista (~45%)
 * con picos en horarios nocturnos.
 */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function getSlotsForVenue(venue: Venue, date: string): Slot[] {
  const slots: Slot[] = [];
  for (const field of venue.fields) {
    for (let hour = venue.openHour; hour < venue.closeHour; hour++) {
      const r = hash(`${field.id}|${date}|${hour}`);
      // Horario pico (18–23): más ocupado
      const peak = hour >= 18 ? 0.62 : 0.32;
      const bookedSeed = r < peak;
      const bookedLive = bookingStore.isTaken(field.id, date, hour);
      const peakPrice = hour >= 18 ? 1.15 : 1;
      slots.push({
        fieldId: field.id,
        date,
        hour,
        available: !bookedSeed && !bookedLive,
        price: Math.round((field.pricePerHour * peakPrice) / 500) * 500,
      });
    }
  }
  return slots;
}

export function getAvailableCount(venue: Venue, date: string) {
  return getSlotsForVenue(venue, date).filter((s) => s.available).length;
}

export function nextAvailableSlots(venue: Venue, date: string, limit = 4) {
  const now = new Date();
  const isToday = date === now.toISOString().slice(0, 10);
  return getSlotsForVenue(venue, date)
    .filter((s) => s.available && (!isToday || s.hour > now.getHours()))
    .sort((a, b) => a.hour - b.hour)
    .slice(0, limit);
}
