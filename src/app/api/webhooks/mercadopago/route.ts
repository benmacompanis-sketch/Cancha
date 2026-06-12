import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook de Mercado Pago.
 * En producción: valida la firma (x-signature) con MERCADOPAGO_WEBHOOK_SECRET,
 * consulta el pago por ID y actualiza Payment + Booking en la base
 * (PENDING_PAYMENT → CONFIRMED), disparando las confirmaciones por
 * email/WhatsApp y la generación del comprobante.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    // Modo demo: los pagos se aprueban de forma simulada en createBooking.
    return NextResponse.json({ received: true, mode: "demo" });
  }

  if (body?.type === "payment" && body?.data?.id) {
    const res = await fetch(
      `https://api.mercadopago.com/v1/payments/${body.data.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      }
    );
    if (res.ok) {
      const payment = await res.json();
      if (payment.status === "approved") {
        // TODO producción: marcar Booking como CONFIRMED vía Prisma
        // usando payment.external_reference (código de reserva).
      }
    }
  }

  return NextResponse.json({ received: true });
}
