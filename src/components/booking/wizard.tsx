"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  Landmark,
  Loader2,
  Wallet,
} from "lucide-react";
import type { Slot, Venue, PaymentKind, PaymentMethod } from "@/lib/data/types";
import { FIELD_TYPE_LABELS } from "@/lib/data/venues";
import { cn, formatARS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldVisual } from "@/components/venue/field-visual";
import { createBooking } from "@/app/reservar/actions";

const STEPS = ["Cancha", "Fecha", "Horario", "Pago"] as const;

interface Props {
  venue: Venue;
  dates: { iso: string; label: string }[];
  slots: Slot[];
  initial: { fieldId?: string; date?: string; hour?: number };
}

export function BookingWizard({ venue, dates, slots, initial }: Props) {
  const router = useRouter();
  const validInitialField = venue.fields.some((f) => f.id === initial.fieldId);
  const [step, setStep] = React.useState(
    initial.hour !== undefined && validInitialField && initial.date ? 3 : 0
  );
  const [fieldId, setFieldId] = React.useState(
    validInitialField ? initial.fieldId! : ""
  );
  const [date, setDate] = React.useState(initial.date ?? "");
  const [hour, setHour] = React.useState<number | null>(initial.hour ?? null);
  const [method, setMethod] = React.useState<PaymentMethod>("mercadopago");
  const [kind, setKind] = React.useState<PaymentKind>("total");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const field = venue.fields.find((f) => f.id === fieldId);
  const slot = slots.find(
    (s) => s.fieldId === fieldId && s.date === date && s.hour === hour
  );
  const price = slot?.price ?? 0;
  const toPay = kind === "seña" ? Math.round(price * 0.3) : price;

  const hourOptions = slots
    .filter((s) => s.fieldId === fieldId && s.date === date)
    .sort((a, b) => a.hour - b.hour);

  const canNext =
    (step === 0 && !!fieldId) ||
    (step === 1 && !!date) ||
    (step === 2 && hour !== null && !!slot?.available);

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await createBooking({
        venueSlug: venue.slug,
        fieldId,
        date,
        hour: hour!,
        paymentMethod: method,
        paymentKind: kind,
        customerName: name,
        customerEmail: email,
      });
      if ("error" in res) setError(res.error ?? "Ocurrió un error inesperado.");
      else router.push(`/reserva/${res.code}`);
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* indicador de progreso */}
      <ol className="flex items-center gap-2" aria-label="Progreso de la reserva">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-1.5">
            <span
              className={cn(
                "h-1.5 rounded-full transition-colors duration-300",
                i <= step ? "bg-primary" : "bg-border"
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                i <= step ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="relative mt-6 min-h-[380px]">
        <AnimatePresence mode="wait">
          {/* ── Paso 1: cancha ── */}
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-semibold">Elegí la cancha</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {venue.fields.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFieldId(f.id)}
                    className={cn(
                      "overflow-hidden rounded-2xl border text-left transition-all active:scale-[0.98]",
                      fieldId === f.id
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-foreground/30"
                    )}
                  >
                    <FieldVisual hue={f.hue} className="aspect-[16/6]" />
                    <div className="flex items-center justify-between p-3.5">
                      <div>
                        <p className="text-sm font-semibold">{f.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {FIELD_TYPE_LABELS[f.type]} ·{" "}
                          {f.roof === "techada" ? "Techada" : "Descubierta"}
                        </p>
                      </div>
                      {fieldId === f.id && (
                        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Paso 2: fecha ── */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-semibold">Elegí el día</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {dates.map((d) => {
                  const free = slots.filter(
                    (s) => s.fieldId === fieldId && s.date === d.iso && s.available
                  ).length;
                  return (
                    <button
                      key={d.iso}
                      onClick={() => setDate(d.iso)}
                      disabled={free === 0}
                      className={cn(
                        "rounded-2xl border p-4 text-center capitalize transition-all active:scale-95",
                        date === d.iso
                          ? "border-primary bg-primary-soft ring-2 ring-primary/30"
                          : "border-border bg-card hover:border-foreground/30",
                        free === 0 && "cursor-not-allowed opacity-40"
                      )}
                    >
                      <CalendarDays className="mx-auto size-5 text-primary" />
                      <p className="mt-2 text-sm font-semibold">{d.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {free} turnos libres
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Paso 3: horario ── */}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-semibold">Elegí el horario</h2>
              <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                {hourOptions.map((s) => (
                  <button
                    key={s.hour}
                    disabled={!s.available}
                    onClick={() => setHour(s.hour)}
                    className={cn(
                      "rounded-xl border px-2 py-3 text-center transition-all active:scale-95",
                      hour === s.hour && s.available
                        ? "border-primary bg-primary text-primary-foreground shadow-premium"
                        : s.available
                          ? "border-border bg-card hover:border-primary"
                          : "cursor-not-allowed border-transparent bg-muted opacity-45"
                    )}
                  >
                    <p className={cn("text-sm font-semibold", !s.available && "line-through")}>
                      {s.hour}:00
                    </p>
                    <p
                      className={cn(
                        "text-[11px]",
                        hour === s.hour && s.available
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      )}
                    >
                      {s.available ? formatARS(s.price) : "Ocupado"}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Paso 4: pago ── */}
          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-semibold">Confirmá y pagá</h2>

              {/* resumen */}
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-premium">
                <FieldVisual hue={field?.hue ?? 145} className="h-16 w-24 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{venue.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {field?.name} · {field ? FIELD_TYPE_LABELS[field.type] : ""}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-3.5" />
                    {dates.find((d) => d.iso === date)?.label ?? date} · {hour}:00 hs
                  </p>
                </div>
                <p className="text-lg font-bold">{formatARS(price)}</p>
              </div>

              {/* datos */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Nombre"
                />
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email"
                />
              </div>

              {/* método de pago */}
              <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                {(
                  [
                    { id: "mercadopago", label: "Mercado Pago", icon: Wallet },
                    { id: "tarjeta", label: "Tarjeta", icon: CreditCard },
                    { id: "transferencia", label: "Transferencia", icon: Landmark },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-medium transition-all active:scale-95",
                      method === m.id
                        ? "border-primary bg-primary-soft"
                        : "border-border bg-card hover:border-foreground/30"
                    )}
                  >
                    <m.icon className="size-4 text-primary" />
                    {m.label}
                  </button>
                ))}
              </div>

              {/* seña o total */}
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setKind("total")}
                  className={cn(
                    "rounded-xl border p-3.5 text-left transition-all active:scale-95",
                    kind === "total"
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-card hover:border-foreground/30"
                  )}
                >
                  <p className="text-sm font-semibold">Pago total</p>
                  <p className="text-xs text-muted-foreground">{formatARS(price)} ahora</p>
                </button>
                <button
                  onClick={() => setKind("seña")}
                  className={cn(
                    "rounded-xl border p-3.5 text-left transition-all active:scale-95",
                    kind === "seña"
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-card hover:border-foreground/30"
                  )}
                >
                  <p className="text-sm font-semibold">Seña 30%</p>
                  <p className="text-xs text-muted-foreground">
                    {formatARS(Math.round(price * 0.3))} ahora, resto en cancha
                  </p>
                </button>
              </div>

              {error && (
                <p className="mt-3 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <Button
                size="lg"
                className="mt-5 w-full"
                disabled={pending || !name || !email}
                onClick={submit}
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Procesando pago…
                  </>
                ) : (
                  <>Pagar {formatARS(toPay)} y confirmar</>
                )}
              </Button>
              <p className="mt-2.5 text-center text-xs text-muted-foreground">
                Pago seguro · Cancelación gratis hasta 24 hs antes
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* navegación */}
      {step < 3 && (
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => (step === 0 ? router.back() : setStep(step - 1))}
          >
            <ArrowLeft />
            Volver
          </Button>
          <Button disabled={!canNext} onClick={() => setStep(step + 1)}>
            Continuar
            <ArrowRight />
          </Button>
        </div>
      )}
      {step === 3 && (
        <div className="mt-4">
          <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
            <ArrowLeft />
            Cambiar horario
          </Button>
        </div>
      )}
    </div>
  );
}
