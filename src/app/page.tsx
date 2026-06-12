import Link from "next/link";
import {
  ArrowRight,
  Car,
  Clock,
  Droplets,
  Flame,
  AtSign,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShowerHead,
  Star,
  UtensilsCrossed,
  Wifi,
  Zap,
  CalendarCheck,
  QrCode,
} from "lucide-react";
import { COMPANY } from "@/lib/data/company";
import { AMENITY_LABELS, FIELD_TYPE_LABELS } from "@/lib/data/venues";
import { formatARS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn, HoverLift } from "@/components/motion";
import { FieldVisual } from "@/components/venue/field-visual";
import { AvailabilityGrid } from "@/components/venue/availability-grid";
import { GoogleReviews } from "@/components/google-reviews";

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  estacionamiento: Car,
  buffet: UtensilsCrossed,
  vestuarios: ShowerHead,
  wifi: Wifi,
  parrilla: Flame,
  "iluminacion-led": Lightbulb,
  duchas: Droplets,
};

export default function Home() {
  const { venue } = COMPANY;

  return (
    <>
      {/* ─────────────── Hero ─────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="absolute left-1/2 top-0 -z-10 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-20">
          <div className="text-center lg:text-left">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium shadow-premium">
                <MapPin className="size-3.5 text-primary" />
                Caballito, CABA · Abierto hoy hasta las 24 hs
              </div>
            </FadeIn>

            <FadeIn delay={1}>
              <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Tu cancha en Caballito,{" "}
                <span className="text-gradient">lista en 30 segundos.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={2}>
              <p className="mx-auto mt-5 max-w-lg text-pretty text-lg text-muted-foreground lg:mx-0">
                {COMPANY.stats.fields} canchas de césped sintético profesional,
                techadas y descubiertas. Elegí tu horario, pagá online y vení a
                jugar. Sin llamadas, sin WhatsApp.
              </p>
            </FadeIn>

            <FadeIn delay={3}>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/reservar" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    Reservar ahora
                    <ArrowRight />
                  </Button>
                </Link>
                <Link href="#canchas" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Conocer las canchas
                  </Button>
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={4}>
              <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
                <div>
                  <p className="flex items-center gap-1 text-xl font-bold text-foreground">
                    {COMPANY.stats.rating}
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                  </p>
                  <p className="text-xs">{COMPANY.stats.reviews} opiniones</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="text-xl font-bold text-foreground">
                    {COMPANY.stats.fields} canchas
                  </p>
                  <p className="text-xs">F5, F7 y F8</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="text-xl font-bold text-foreground">
                    {COMPANY.stats.yearsOpen} años
                  </p>
                  <p className="text-xs">en el barrio</p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Disponibilidad real en el hero */}
          <FadeIn delay={2}>
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-primary/20 via-accent/10 to-transparent blur-2xl"
              />
              <AvailabilityGrid venue={venue} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─────────────── Canchas ─────────────── */}
      <section id="canchas" className="border-y border-border bg-card/50 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Nuestras canchas
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Césped sintético FIFA Quality renovado en 2025 e iluminación LED
              profesional en todas las canchas.
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {venue.fields.map((f, i) => (
              <FadeIn key={f.id} delay={i}>
                <HoverLift className="h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
                    <FieldVisual hue={f.hue} className="aspect-[16/10]" label={f.name} />
                    <div className="flex flex-1 flex-col p-4">
                      <p className="font-semibold">{f.name}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge variant="secondary">{FIELD_TYPE_LABELS[f.type]}</Badge>
                        <Badge variant="secondary">
                          {f.roof === "techada" ? "Techada" : "Descubierta"}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        <span className="text-lg font-bold text-foreground">
                          {formatARS(f.pricePerHour)}
                        </span>{" "}
                        / hora
                      </p>
                      <Link
                        href={`/reservar?cancha=${f.id}`}
                        className="mt-auto pt-4"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          Reservar esta cancha
                        </Button>
                      </Link>
                    </div>
                  </div>
                </HoverLift>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── Cómo funciona ─────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <FadeIn className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Reservar es así de simple
          </h2>
        </FadeIn>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {[
            {
              icon: Zap,
              step: "01",
              title: "Elegí tu turno",
              text: "Mirá la disponibilidad en tiempo real y elegí cancha, día y horario.",
            },
            {
              icon: CalendarCheck,
              step: "02",
              title: "Pagá online",
              text: "Mercado Pago, tarjeta o transferencia. Señá el 30% o pagá el total.",
            },
            {
              icon: QrCode,
              step: "03",
              title: "Veni a jugar",
              text: "Recibís el QR por WhatsApp y email. Lo mostrás en recepción y a la cancha.",
            },
          ].map((s, i) => (
            <FadeIn key={s.step} delay={i} className="text-center">
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
      </section>

      {/* ─────────────── Servicios ─────────────── */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Mucho más que canchas
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Buffet completo con parrilla para el tercer tiempo, vestuarios
                climatizados con duchas, estacionamiento propio y Wi-Fi en todo
                el predio. Venís a jugar y te quedás a comer algo.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {venue.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a] ?? Zap;
                  return (
                    <div
                      key={a}
                      className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3 text-sm font-medium"
                    >
                      <Icon className="size-4 text-primary" />
                      {AMENITY_LABELS[a]}
                    </div>
                  );
                })}
              </div>
            </FadeIn>
            <FadeIn delay={2}>
              <div className="grid grid-cols-2 gap-3">
                <FieldVisual hue={150} className="aspect-square rounded-2xl" label="Cancha 1" />
                <FieldVisual hue={130} className="aspect-square rounded-2xl" label="Cancha 3" />
                <div className="col-span-2 flex aspect-[2/0.9] items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-700 p-6 text-center shadow-premium-lg">
                  <div>
                    <p className="text-3xl font-black text-white">⚽ Torneo Clausura F5</p>
                    <p className="mt-1 text-sm text-white/85">
                      Inscripción abierta · Arranca el 5 de julio · $500.000 en premios
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─────────────── Reseñas de Google ─────────────── */}
      <GoogleReviews />

      {/* ─────────────── Ubicación y contacto ─────────────── */}
      <section id="ubicacion" className="border-t border-border bg-card/50 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Vení a conocernos
              </h2>
              <div className="mt-6 space-y-4 text-sm">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    <span className="font-semibold">{COMPANY.address}</span>
                    <br />
                    <span className="text-muted-foreground">
                      A 2 cuadras de la estación Acoyte (subte A)
                    </span>
                  </span>
                </p>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="space-y-1">
                    {COMPANY.hours.map((h) => (
                      <p key={h.days}>
                        <span className="font-semibold">{h.days}:</span>{" "}
                        <span className="text-muted-foreground">{h.time}</span>
                      </p>
                    ))}
                  </div>
                </div>
                <p className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-primary" />
                  <span className="font-semibold">{COMPANY.phone}</span>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-primary" />
                  <span className="font-semibold">{COMPANY.email}</span>
                </p>
                <p className="flex items-center gap-3">
                  <AtSign className="size-4 shrink-0 text-primary" />
                  <span className="font-semibold">{COMPANY.instagram}</span>
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[#25D366] text-white hover:bg-[#1fb858] hover:brightness-100">
                    <MessageCircle />
                    Escribinos por WhatsApp
                  </Button>
                </a>
                <Link href="/reservar">
                  <Button variant="outline">Reservar online</Button>
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={2}>
              {/* Banner de Google Maps (embed real, sin API key) */}
              <div className="relative h-80 overflow-hidden rounded-2xl border border-border bg-muted shadow-premium lg:h-full lg:min-h-96">
                <iframe
                  title={`Mapa de ${COMPANY.name} — ${COMPANY.address}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(COMPANY.address)}&z=16&output=embed&hl=es`}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─────────────── CTA final ─────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-emerald-700 px-6 py-14 text-center shadow-premium-lg sm:px-16">
            <div aria-hidden className="absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
            <div aria-hidden className="absolute -bottom-24 -left-16 size-72 rounded-full bg-black/10 blur-3xl" />
            <h2 className="relative text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tu próximo partido está a 30 segundos
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-lg text-white/85">
              Cancelación gratis hasta 24 hs antes. Si llueve y tu cancha es
              descubierta, reprogramás sin costo.
            </p>
            <div className="relative mt-7">
              <Link href="/reservar">
                <Button size="lg" className="bg-white text-emerald-800 hover:bg-white/90 hover:brightness-100">
                  Reservar ahora
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
