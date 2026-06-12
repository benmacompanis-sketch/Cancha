"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MapPin, Star } from "lucide-react";

/**
 * Mockup animado de la plataforma: cicla entre selección de horario,
 * selección de cancha y reserva confirmada.
 */
const HOURS = ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
const TAKEN = new Set(["18:00", "21:00"]);

export function HeroMockup() {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 3), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* glow decorativo */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-tr from-primary/25 via-accent/15 to-transparent blur-3xl"
      />

      <div className="glass overflow-hidden rounded-3xl shadow-premium-lg">
        {/* barra de navegador */}
        <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-3">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-green-400/80" />
          <div className="ml-3 flex-1 rounded-md bg-muted px-3 py-1 text-[10px] text-muted-foreground">
            cancha.app/complejos/la-bombonerita
          </div>
        </div>

        <div className="relative h-[340px] p-5">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="hours"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-xs font-medium text-muted-foreground">
                  Paso 1 · Elegí tu horario
                </p>
                <h4 className="mt-1 font-semibold">Hoy, jueves</h4>
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  {HOURS.map((h, i) => {
                    const taken = TAKEN.has(h);
                    const selected = h === "20:00";
                    return (
                      <motion.div
                        key={h}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.08 * i }}
                        className={`rounded-xl border px-3 py-3 text-center text-sm font-medium transition-colors ${
                          taken
                            ? "border-border bg-muted text-muted-foreground line-through opacity-50"
                            : selected
                              ? "border-primary bg-primary text-primary-foreground shadow-premium"
                              : "border-border bg-card"
                        }`}
                      >
                        {h}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary-soft px-3 py-2.5 text-xs font-medium text-primary">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                  </span>
                  Disponibilidad en tiempo real
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="field"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-xs font-medium text-muted-foreground">
                  Paso 2 · Elegí tu cancha
                </p>
                <h4 className="mt-1 font-semibold">La Bombonerita · Caballito</h4>
                <div className="mt-4 space-y-2.5">
                  {[
                    { name: "Cancha 1 · Maracaná", type: "F5 · Techada", price: "$28.000", sel: true },
                    { name: "Cancha 3 · Azteca", type: "F7 · Descubierta", price: "$42.000", sel: false },
                  ].map((c, i) => (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 * i }}
                      className={`flex items-center gap-3 rounded-xl border p-3 ${
                        c.sel
                          ? "border-primary bg-primary-soft"
                          : "border-border bg-card"
                      }`}
                    >
                      <div
                        className="h-12 w-16 shrink-0 rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, hsl(150 60% ${c.sel ? 38 : 32}%), hsl(150 65% 24%))`,
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.type}</p>
                      </div>
                      <p className="text-sm font-semibold">{c.price}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  4.9 · 482 opiniones
                  <MapPin className="ml-2 size-3.5" />
                  Caballito
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
                className="flex h-full flex-col items-center justify-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.15 }}
                  className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-premium-lg"
                >
                  <Check className="size-8" strokeWidth={3} />
                </motion.div>
                <h4 className="mt-4 text-lg font-bold">¡Reserva confirmada!</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cancha 1 · Hoy 20:00 hs
                </p>
                <div className="mt-4 rounded-xl border border-border bg-card px-4 py-2 font-mono text-sm font-semibold tracking-widest">
                  CN-8F2K4A
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Te enviamos el QR por WhatsApp y email ✓
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* indicador de pasos */}
        <div className="flex justify-center gap-1.5 pb-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-primary" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
