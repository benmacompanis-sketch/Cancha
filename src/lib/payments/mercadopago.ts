import type { Booking } from "@/lib/data/types";

/**
 * Integración con Mercado Pago (Checkout Pro).
 *
 * En producción: se crea una "preference" por reserva y el webhook
 * (src/app/api/webhooks/mercadopago/route.ts) confirma el pago.
 * Sin MERCADOPAGO_ACCESS_TOKEN configurado, opera en modo demo y
 * aprueba el pago de forma simulada para poder probar el flujo completo.
 */
export const isLiveMode = Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);

export interface PaymentPreference {
  id: string;
  initPoint: string;
}

export async function createPreference(booking: {
  code: string;
  title: string;
  amount: number;
  payerEmail: string;
}): Promise<PaymentPreference> {
  if (!isLiveMode) {
    return { id: `demo-${booking.code}`, initPoint: "" };
  }

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          title: booking.title,
          quantity: 1,
          unit_price: booking.amount,
          currency_id: "ARS",
        },
      ],
      payer: { email: booking.payerEmail },
      external_reference: booking.code,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/reserva/${booking.code}`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/reserva/${booking.code}?pago=error`,
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    }),
  });

  if (!res.ok) throw new Error(`Mercado Pago error: ${res.status}`);
  const data = await res.json();
  return { id: data.id, initPoint: data.init_point };
}

export async function sendConfirmations(booking: Booking) {
  // Email vía Resend + WhatsApp Cloud API. En modo demo solo loguea.
  if (!process.env.RESEND_API_KEY) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: booking.customerEmail,
      subject: `✅ Reserva confirmada — ${booking.venueName}`,
      html: `<h1>¡Reserva confirmada!</h1><p>${booking.fieldName} · ${booking.date} ${booking.hour}:00 hs.</p><p>Código: <strong>${booking.code}</strong></p>`,
    }),
  });
}
