"use client";

import type { Slot, Venue } from "./types";

/**
 * Configuración del complejo administrable desde el panel.
 * Se persiste en localStorage (modo demo / hosting estático) y los
 * cambios impactan en la web pública: precios, turnos bloqueados,
 * horarios de apertura y porcentaje de seña. En producción esta capa
 * se reemplaza por Prisma (tablas Field, PriceRule y un BlockedSlot)
 * manteniendo el mismo contrato.
 */
export interface AdminSettings {
  /** precio por hora por cancha (override del precio base) */
  fieldPrices: Record<string, number>;
  /** canchas deshabilitadas (mantenimiento, etc.) */
  inactiveFields: string[];
  /** turnos bloqueados manualmente: "fieldId|YYYY-MM-DD|hour" */
  blockedSlots: string[];
  openHour?: number;
  closeHour?: number;
  /** porcentaje de seña que se cobra online */
  depositPct: number;
}

const KEY = "cancha.admin.settings.v1";

const DEFAULTS: AdminSettings = {
  fieldPrices: {},
  inactiveFields: [],
  blockedSlots: [],
  depositPct: 30,
};

export function getAdminSettings(): AdminSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    return { ...DEFAULTS, ...JSON.parse(window.localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return DEFAULTS;
  }
}

export function saveAdminSettings(patch: Partial<AdminSettings>): AdminSettings {
  const next = { ...getAdminSettings(), ...patch };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function resetAdminSettings() {
  window.localStorage.removeItem(KEY);
}

const slotKey = (fieldId: string, date: string, hour: number) =>
  `${fieldId}|${date}|${hour}`;

export function isSlotBlocked(fieldId: string, date: string, hour: number) {
  return getAdminSettings().blockedSlots.includes(slotKey(fieldId, date, hour));
}

export function toggleSlotBlock(fieldId: string, date: string, hour: number) {
  const s = getAdminSettings();
  const key = slotKey(fieldId, date, hour);
  const blockedSlots = s.blockedSlots.includes(key)
    ? s.blockedSlots.filter((k) => k !== key)
    : [...s.blockedSlots, key];
  return saveAdminSettings({ blockedSlots });
}

/** Venue con la configuración del admin aplicada (precios, canchas, horarios). */
export function getEffectiveVenue(venue: Venue): Venue {
  const s = getAdminSettings();
  return {
    ...venue,
    openHour: s.openHour ?? venue.openHour,
    closeHour: s.closeHour ?? venue.closeHour,
    fields: venue.fields
      .filter((f) => !s.inactiveFields.includes(f.id))
      .map((f) => ({
        ...f,
        pricePerHour: s.fieldPrices[f.id] ?? f.pricePerHour,
      })),
  };
}

/** Marca como no disponibles los turnos bloqueados por el admin. */
export function applyBlockedSlots(slots: Slot[]): Slot[] {
  const blocked = new Set(getAdminSettings().blockedSlots);
  return slots.map((s) =>
    blocked.has(slotKey(s.fieldId, s.date, s.hour)) ? { ...s, available: false } : s
  );
}
