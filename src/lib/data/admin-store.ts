"use client";

import type { Slot, Venue } from "./types";

/**
 * Configuración del complejo administrable desde el panel.
 * Se persiste en localStorage (modo demo / hosting estático) y los
 * cambios impactan en la web pública: precios, estado de cada turno
 * (ocupado/disponible), horarios de apertura y porcentaje de seña.
 * En producción esta capa se reemplaza por Prisma manteniendo el
 * mismo contrato.
 */
export type SlotState = "ocupado" | "libre";

export interface AdminSettings {
  /** precio por hora por cancha (override del precio base) */
  fieldPrices: Record<string, number>;
  /** canchas deshabilitadas (mantenimiento, etc.) */
  inactiveFields: string[];
  /** estado forzado por turno: "fieldId|YYYY-MM-DD|hour" → ocupado/libre */
  slotOverrides: Record<string, SlotState>;
  openHour?: number;
  closeHour?: number;
  /** porcentaje de seña que se cobra online */
  depositPct: number;
}

const KEY = "cancha.admin.settings.v2";

const DEFAULTS: AdminSettings = {
  fieldPrices: {},
  inactiveFields: [],
  slotOverrides: {},
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

export const slotKey = (fieldId: string, date: string, hour: number) =>
  `${fieldId}|${date}|${hour}`;

/** Fuerza el estado de un turno (el admin puede ocupar o liberar cualquiera). */
export function setSlotState(
  fieldId: string,
  date: string,
  hour: number,
  state: SlotState
) {
  const s = getAdminSettings();
  return saveAdminSettings({
    slotOverrides: { ...s.slotOverrides, [slotKey(fieldId, date, hour)]: state },
  });
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

/** Aplica los estados forzados por el admin sobre la disponibilidad base. */
export function applySlotOverrides(slots: Slot[]): Slot[] {
  const overrides = getAdminSettings().slotOverrides;
  return slots.map((s) => {
    const o = overrides[slotKey(s.fieldId, s.date, s.hour)];
    if (!o) return s;
    return { ...s, available: o === "libre" };
  });
}
