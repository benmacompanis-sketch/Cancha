import type { Booking } from "./types";
import { addDays, toISODate } from "@/lib/utils";

/**
 * Datos del usuario demo. En producción se obtienen de la sesión
 * de Clerk + queries Prisma (ver docs/DATABASE.md).
 */
export const demoUser = {
  name: "Juan Pérez",
  email: "juan@ejemplo.com",
  avatar: "JP",
  points: 1240,
  ranking: 18,
  referralCode: "JUAN-2026",
  stats: {
    played: 47,
    goals: 38,
    assists: 21,
    mvp: 6,
    winRate: 0.62,
    streak: 4,
  },
  teams: [
    { id: "t1", name: "Los Pibes FC", role: "Capitán", members: 9, color: "#2563eb" },
    { id: "t2", name: "Deportivo Oficina", role: "Jugador", members: 12, color: "#0ea5e9" },
  ],
};

const seededUpcoming: Booking[] = [
  {
    id: "seed-1",
    code: "CV-7K2M9D",
    venueSlug: "cover-fc",
    venueName: "Cover FC",
    fieldId: "cv-f1",
    fieldName: "Cancha 1",
    fieldType: "F5",
    date: toISODate(addDays(new Date(), 2)),
    hour: 20,
    price: 27500,
    paidAmount: 27500,
    paymentMethod: "mercadopago",
    paymentKind: "total",
    status: "confirmada",
    createdAt: new Date().toISOString(),
    customerName: demoUser.name,
    customerEmail: demoUser.email,
  },
];

const seededHistory: Booking[] = [
  {
    id: "seed-h1",
    code: "CV-3A8Q1Z",
    venueSlug: "cover-fc",
    venueName: "Cover FC",
    fieldId: "cv-f2",
    fieldName: "Cancha 2",
    fieldType: "F5",
    date: toISODate(addDays(new Date(), -5)),
    hour: 21,
    price: 27500,
    paidAmount: 27500,
    paymentMethod: "tarjeta",
    paymentKind: "total",
    status: "jugada",
    createdAt: new Date().toISOString(),
    customerName: demoUser.name,
    customerEmail: demoUser.email,
  },
  {
    id: "seed-h2",
    code: "CV-9D4X2B",
    venueSlug: "cover-fc",
    venueName: "Cover FC",
    fieldId: "cv-f3",
    fieldName: "Cancha 3",
    fieldType: "F8",
    date: toISODate(addDays(new Date(), -12)),
    hour: 19,
    price: 43500,
    paidAmount: 13050,
    paymentMethod: "mercadopago",
    paymentKind: "seña",
    status: "jugada",
    createdAt: new Date().toISOString(),
    customerName: demoUser.name,
    customerEmail: demoUser.email,
  },
  {
    id: "seed-h3",
    code: "CV-5F7J3C",
    venueSlug: "cover-fc",
    venueName: "Cover FC",
    fieldId: "cv-f1",
    fieldName: "Cancha 1",
    fieldType: "F5",
    date: toISODate(addDays(new Date(), -19)),
    hour: 22,
    price: 27500,
    paidAmount: 27500,
    paymentMethod: "transferencia",
    paymentKind: "total",
    status: "cancelada",
    createdAt: new Date().toISOString(),
    customerName: demoUser.name,
    customerEmail: demoUser.email,
  },
];

/**
 * Combina las reservas seed del usuario demo con las reservas vivas
 * (`extra`: por ejemplo, las guardadas en localStorage por el cliente).
 */
export function getUserBookings(extra: Booking[] = []) {
  const today = toISODate(new Date());
  const live = extra.filter((b) => b.status !== "cancelada");
  const upcoming = [...live.filter((b) => b.date >= today), ...seededUpcoming].sort(
    (a, b) => a.date.localeCompare(b.date) || a.hour - b.hour
  );
  const history = [
    ...live.filter((b) => b.date < today),
    ...seededHistory,
  ].sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, history };
}
