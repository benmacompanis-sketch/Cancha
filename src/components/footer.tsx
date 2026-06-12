import Link from "next/link";
import { Logo } from "@/components/logo";

const columns = [
  {
    title: "Producto",
    links: [
      { label: "Explorar complejos", href: "/buscar" },
      { label: "Mis partidos", href: "/dashboard" },
      { label: "Torneos", href: "/dashboard" },
      { label: "Ranking", href: "/dashboard" },
    ],
  },
  {
    title: "Para complejos",
    links: [
      { label: "Panel de administración", href: "/admin" },
      { label: "Multi-sucursal", href: "/admin" },
      { label: "Reportes", href: "/admin" },
    ],
  },
  {
    title: "Compañía",
    links: [
      { label: "Sobre Cancha", href: "/" },
      { label: "Términos", href: "/" },
      { label: "Privacidad", href: "/" },
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
              La forma más rápida de reservar canchas de fútbol en Argentina.
              Sin llamadas, sin WhatsApp, sin vueltas.
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
          <p>© {new Date().getFullYear()} Cancha · Hecho en Argentina 🇦🇷</p>
          <p>Buenos Aires · Córdoba · Rosario · Mendoza</p>
        </div>
      </div>
    </footer>
  );
}
