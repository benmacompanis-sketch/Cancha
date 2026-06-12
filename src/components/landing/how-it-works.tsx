import { Search, CalendarCheck, PartyPopper } from "lucide-react";
import { FadeIn } from "@/components/motion";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Buscá",
    text: "Filtrá por barrio, fecha, hora, tipo de cancha y servicios. Resultados al instante.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Reservá y pagá",
    text: "Elegí tu turno libre y pagá online con Mercado Pago. Señá o total, vos decidís.",
  },
  {
    icon: PartyPopper,
    step: "03",
    title: "Jugá",
    text: "Recibís el QR por WhatsApp y email. Llegás, escaneás y a la cancha.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
        <FadeIn className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            De cero al partido en 3 pasos
          </h2>
        </FadeIn>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <FadeIn key={s.step} delay={i} className="relative text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-premium-lg">
                <s.icon className="size-6" />
              </div>
              <p className="mt-4 font-mono text-xs font-semibold tracking-widest text-primary">
                PASO {s.step}
              </p>
              <h3 className="mt-1 text-xl font-semibold">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                {s.text}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
