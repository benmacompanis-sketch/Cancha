"use client";

/**
 * Autenticación del panel de administración (modo demo).
 * Credenciales fijas + sesión con expiración en localStorage.
 * En producción se reemplaza por Clerk con rol VENUE_OWNER/VENUE_STAFF
 * (ver prisma/schema.prisma) y middleware de servidor.
 */
export const DEMO_ADMIN = {
  email: "admin@labombonerita.com",
  password: "admin123",
};

const KEY = "cancha.admin.session.v1";
const SESSION_HOURS = 8;

export function adminLogin(email: string, password: string): boolean {
  if (
    email.trim().toLowerCase() !== DEMO_ADMIN.email ||
    password !== DEMO_ADMIN.password
  ) {
    return false;
  }
  window.localStorage.setItem(
    KEY,
    JSON.stringify({ email: DEMO_ADMIN.email, exp: Date.now() + SESSION_HOURS * 3600_000 })
  );
  return true;
}

export function adminLogout() {
  window.localStorage.removeItem(KEY);
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const s = JSON.parse(window.localStorage.getItem(KEY) ?? "null");
    return Boolean(s && typeof s.exp === "number" && s.exp > Date.now());
  } catch {
    return false;
  }
}
