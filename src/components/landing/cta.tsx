import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-emerald-700 px-6 py-16 text-center shadow-premium-lg sm:px-16">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-16 size-72 rounded-full bg-black/10 blur-3xl"
          />
          <h2 className="relative text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tu próximo partido está a 30 segundos
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/85">
            Sumate a los miles de jugadores que ya reservan sin llamadas ni
            esperas.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/buscar">
              <Button
                size="lg"
                className="bg-white text-emerald-800 hover:bg-white/90 hover:brightness-100"
              >
                Reservar ahora
                <ArrowRight />
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                Soy dueño de un complejo
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
