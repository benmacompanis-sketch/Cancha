import Link from "next/link";
import { Logo } from "@/components/logo";
import { COMPANY } from "@/lib/data/company";

const columns = [
  {
    title: "Reservas",
    links: [
      { label: "Reservar cancha", href: "/reservar" },
      { label: "Mis reservas", href: "/dashboard" },
      { label: "Torneos", href: "/#canchas" },
    ],
  },
  {
    title: "El complejo",
    links: [
      { label: "Nuestras canchas", href: "/#canchas" },
      { label: "Ubicación y horarios", href: "/#ubicacion" },
      { label: "Panel de administración", href: "/admin" },
    ],
  },
  {
    title: "Contacto",
    links: [
      { label: COMPANY.phone, href: `tel:${COMPANY.phone.replace(/\s/g, "")}` },
      { label: "WhatsApp", href: `https://wa.me/${COMPANY.whatsapp.replace(/\D/g, "")}` },
      { label: COMPANY.address, href: "/#ubicacion" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {COMPANY.tagline}. {COMPANY.address}. Reservá online y vení a
              jugar: sin llamadas, sin vueltas.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {COMPANY.name} · Almagro, Buenos Aires 🇦🇷
          </p>
          <p>Abierto todos los días de 10:00 a 00:30</p>
        </div>
      </div>
    </footer>
  );
}
