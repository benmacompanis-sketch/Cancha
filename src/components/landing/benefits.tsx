import {
  Radio,
  Zap,
  CreditCard,
  BellRing,
  History,
  Users,
  Trophy,
  BarChart3,
} from "lucide-react";
import { FadeIn, HoverLift } from "@/components/motion";

const benefits = [
  {
    icon: Radio,
    title: "Disponibilidad en tiempo real",
    text: "Ves exactamente qué turnos están libres, sincronizado al segundo con cada complejo.",
  },
  {
    icon: Zap,
    title: "Reserva instantánea",
    text: "Elegís cancha, día y hora. Confirmás en menos de 30 segundos, sin esperar respuestas.",
  },
  {
    icon: CreditCard,
    title: "Pagos online",
    text: "Mercado Pago, tarjetas o transferencia. Señá o pagá el total, como prefieras.",
  },
  {
    icon: BellRing,
    title: "Confirmación automática",
    text: "Comprobante, QR de acceso y recordatorios por WhatsApp y email, sin mover un dedo.",
  },
  {
    icon: History,
    title: "Historial de partidos",
    text: "Todos tus partidos, facturas y complejos favoritos en un solo lugar.",
  },
  {
    icon: Users,
    title: "Gestión de equipos",
    text: "Armá tu equipo, invitá jugadores y dividí el pago de la cancha entre todos.",
  },
  {
    icon: Trophy,
    title: "Ranking de jugadores",
    text: "Sumá puntos por partido jugado y subí en el ranking de tu barrio.",
  },
  {
    icon: BarChart3,
    title: "Estadísticas personales",
    text: "Goles, asistencias, partidos jugados y rachas. Tu carrera amateur, medida.",
  },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Todo lo que necesitás para jugar,{" "}
          <span className="text-gradient">en una sola app</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Desde encontrar cancha hasta el tercer tiempo: la experiencia completa,
          diseñada para jugadores.
        </p>
      </FadeIn>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b, i) => (
          <FadeIn key={b.title} delay={i % 4}>
            <HoverLift className="h-full">
              <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform duration-300 group-hover:scale-110">
                  <b.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {b.text}
                </p>
              </div>
            </HoverLift>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
