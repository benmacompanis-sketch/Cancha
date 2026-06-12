"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroMockup } from "./hero-mockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-10 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:pb-28 lg:pt-24">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium shadow-premium"
          >
            <Zap className="size-3.5 text-primary" />
            Más de 12.000 partidos reservados este mes
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Reservá tu cancha <span className="text-gradient">en segundos.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mx-auto mt-5 max-w-lg text-pretty text-lg text-muted-foreground lg:mx-0"
          >
            Encontrá disponibilidad en tiempo real y asegurá tu partido sin
            llamadas ni WhatsApp.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center"
          >
            <Link href="/buscar" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Reservar ahora
                <ArrowRight />
              </Button>
            </Link>
            <Link href="/buscar" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explorar complejos
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start"
          >
            <div>
              <p className="text-xl font-bold text-foreground">350+</p>
              <p className="text-xs">complejos</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xl font-bold text-foreground">98%</p>
              <p className="text-xs">confirmación instantánea</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xl font-bold text-foreground">4.9★</p>
              <p className="text-xs">valoración promedio</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <HeroMockup />
        </motion.div>
      </div>
    </section>
  );
}
