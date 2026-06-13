import { NextRequest, NextResponse } from "next/server";
import { getVenue } from "@/lib/data/venues";
import { getSlotsForVenue } from "@/lib/data/availability";
import { toISODate } from "@/lib/utils";

/**
 * GET /api/disponibilidad?complejo=cover-fc&fecha=2026-06-12
 * Disponibilidad en tiempo real de un complejo para una fecha.
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("complejo");
  const date = req.nextUrl.searchParams.get("fecha") ?? toISODate(new Date());

  if (!slug) {
    return NextResponse.json({ error: "Falta el parámetro 'complejo'" }, { status: 400 });
  }
  const venue = getVenue(slug);
  if (!venue) {
    return NextResponse.json({ error: "Complejo no encontrado" }, { status: 404 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Fecha inválida (YYYY-MM-DD)" }, { status: 400 });
  }

  return NextResponse.json(
    { complejo: slug, fecha: date, slots: getSlotsForVenue(venue, date) },
    { headers: { "Cache-Control": "no-store" } }
  );
}
