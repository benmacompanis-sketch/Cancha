import { addDays, toISODate } from "@/lib/utils";

/**
 * Métricas del panel de administración (demo).
 * En producción se calculan con agregaciones SQL sobre Booking/Payment.
 */
export const adminMetrics = {
  venueName: "La Bombonerita",
  branches: ["Caballito", "Flores", "Almagro"],
  kpis: {
    todayBookings: 18,
    todayRevenue: 612000,
    occupancy: 0.78,
    freeSlotsToday: 11,
    monthRevenue: 14250000,
    monthRevenueDelta: 0.18,
    newClients: 42,
    cancellationRate: 0.04,
  },
  revenueByDay: [
    420, 380, 510, 465, 590, 720, 810, 540, 470, 605, 660, 700, 850, 920,
  ].map((v, i) => ({
    date: toISODate(addDays(new Date(), i - 13)),
    value: v * 1000,
  })),
  occupancyByHour: [
    { hour: "9", value: 22 },
    { hour: "11", value: 35 },
    { hour: "13", value: 41 },
    { hour: "15", value: 48 },
    { hour: "17", value: 66 },
    { hour: "18", value: 84 },
    { hour: "19", value: 95 },
    { hour: "20", value: 98 },
    { hour: "21", value: 92 },
    { hour: "22", value: 75 },
  ],
  revenueByField: [
    { name: "Cancha 1", value: 38 },
    { name: "Cancha 2", value: 27 },
    { name: "Cancha 3", value: 21 },
    { name: "Cancha 4", value: 14 },
  ],
  todaySchedule: [
    { hour: 18, field: "Cancha 1", client: "Martín G.", status: "confirmada", amount: 32000 },
    { hour: 18, field: "Cancha 3", client: "Equipo Nébula", status: "confirmada", amount: 48000 },
    { hour: 19, field: "Cancha 1", client: "Lucas P.", status: "seña", amount: 32000 },
    { hour: 19, field: "Cancha 2", client: "Deportivo Oficina", status: "confirmada", amount: 32000 },
    { hour: 20, field: "Cancha 1", client: "Juan Pérez", status: "confirmada", amount: 32000 },
    { hour: 20, field: "Cancha 4", client: "—", status: "libre", amount: 0 },
    { hour: 21, field: "Cancha 2", client: "Los Pibes FC", status: "seña", amount: 32000 },
    { hour: 22, field: "Cancha 3", client: "—", status: "libre", amount: 0 },
  ],
  topClients: [
    { name: "Los Pibes FC", bookings: 14, spent: 448000 },
    { name: "Deportivo Oficina", bookings: 11, spent: 352000 },
    { name: "Martín G.", bookings: 9, spent: 288000 },
    { name: "Equipo Nébula", bookings: 7, spent: 336000 },
  ],
};
