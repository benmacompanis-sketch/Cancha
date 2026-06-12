import { Star, ExternalLink } from "lucide-react";
import { COMPANY } from "@/lib/data/company";
import { FadeIn } from "@/components/motion";

/** Logo multicolor "G" de Google. */
function GoogleG({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.1V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.61 0 3.06.55 4.2 1.64l3.16-3.16A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function Stars({ className = "size-3.5" }: { className?: string }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} fill-amber-400 text-amber-400`} />
      ))}
    </span>
  );
}

const GOOGLE_REVIEWS = [
  {
    initials: "MR",
    color: "#3b82f6",
    name: "Marcos R.",
    role: "Jugador frecuente · F5",
    when: "hace 2 semanas",
    text: "La Bombonerita es un nivel aparte. El sintético es nuevo, la iluminación de noche es perfecta y reservás online en 30 segundos. Volvemos todos los jueves.",
  },
  {
    initials: "VL",
    color: "#8b5cf6",
    name: "Valentina L.",
    role: "Reseñas locales · Google Maps",
    when: "hace 1 mes",
    text: "Organizamos el torneo de la oficina acá y salió todo perfecto. Vestuarios limpios, buffet con buena onda. El precio/calidad es inmejorable en Caballito.",
  },
  {
    initials: "DM",
    color: "#10b981",
    name: "Diego M.",
    role: "Local Guide · Google Maps",
    when: "hace 3 semanas",
    text: "La reserva con QR es una genialidad: llegás, escaneás y a la cancha. La techada nos salvó un día de lluvia. El tercer tiempo con parrilla, una bestialidad.",
  },
  {
    initials: "CF",
    color: "#f97316",
    name: "Carla F.",
    role: "Local Guide · 2025",
    when: "hace 2 meses",
    text: "Complejo honesto y bien cuidado. La atención al cliente es excepcional y las canchas techadas son los hits, pero las descubiertas no se quedan atrás.",
  },
];

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`${COMPANY.name} ${COMPANY.address}`);

export function GoogleReviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      {/* Banner de rating */}
      <FadeIn>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-premium">
          <span className="flex items-center gap-2.5 font-semibold">
            <GoogleG />
            Reseñas de Google
          </span>
          <span className="hidden h-6 w-px bg-border sm:block" />
          <span className="flex items-center gap-2.5">
            <span className="text-3xl font-black text-amber-400">
              {COMPANY.stats.rating}
            </span>
            <Stars className="size-4" />
          </span>
          <span className="text-sm text-muted-foreground">
            basado en reseñas recientes
          </span>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-amber-500 hover:underline dark:text-amber-400"
          >
            Ver todas en Google
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </FadeIn>

      {/* Cards de reseñas */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {GOOGLE_REVIEWS.map((r, i) => (
          <FadeIn key={r.name} delay={i}>
            <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-premium">
              <div className="flex items-start gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: r.color }}
                >
                  {r.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{r.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.role}</p>
                </div>
                <GoogleG className="size-4 shrink-0" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Stars />
                <span className="text-xs text-muted-foreground">{r.when}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {r.text}
              </p>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
