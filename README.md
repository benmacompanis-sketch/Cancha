# ⚽ Cancha

**Reservá tu cancha en segundos.** Plataforma premium de reservas de canchas de fútbol para Argentina: disponibilidad en tiempo real, reserva en menos de 30 segundos, pagos online y gestión completa para complejos deportivos.

![Stack](https://img.shields.io/badge/Next.js%2015-black) ![TS](https://img.shields.io/badge/TypeScript-blue) ![Tailwind](https://img.shields.io/badge/Tailwind%20v4-38bdf8) ![Prisma](https://img.shields.io/badge/Prisma%20%2B%20PostgreSQL-2d3748)

## 🚀 Quickstart

```bash
npm install
npm run dev        # http://localhost:3000
```

Funciona out-of-the-box en **modo demo** (datos seed en memoria, pagos simulados). Para producción, copiá `.env.example` a `.env` y configurá Clerk, Mercado Pago, Resend, WhatsApp API y `DATABASE_URL` (PostgreSQL + `npx prisma migrate dev`).

## ✨ Qué incluye

| Área | Funcionalidad |
|---|---|
| **Landing** | Hero con mockup animado del producto, beneficios, cómo funciona, complejos destacados, CTA |
| **Buscador** (`/buscar`) | Estilo Airbnb: autocompletado inteligente, filtros (ciudad, barrio, fecha, hora, precio, F5–F11, techada/descubierta, superficie, servicios), resultados instantáneos y mapa interactivo con pins de precio |
| **Complejo** (`/complejos/[slug]`) | Galería, descripción, canchas, servicios, ubicación, opiniones y grilla de disponibilidad en tiempo real |
| **Reservas** (`/reservar/[slug]`) | Wizard de 4 pasos sin recargas: cancha → fecha → horario → pago (Mercado Pago / tarjeta / transferencia, seña 30% o total) |
| **Confirmación** (`/reserva/[code]`) | Ticket con QR de acceso real, comprobante y aviso de envío por WhatsApp/email |
| **Dashboard usuario** (`/dashboard`) | Próximos partidos, historial, favoritos, equipos, facturas, estadísticas personales, puntos, ranking y referidos |
| **Dashboard admin** (`/admin`) | KPIs del día, ingresos (gráfico de área), ocupación por horario (barras), ingresos por cancha (donut), agenda live, clientes frecuentes, multi-sucursal y export de reportes |
| **API** | `GET /api/disponibilidad`, webhook de Mercado Pago, Server Actions para crear reservas con validación anti doble-booking |
| **SEO** | Metadata dinámica, Open Graph, sitemap, robots, manifest PWA, JSON-LD (`Organization`, `SportsActivityLocation`), URLs amigables |
| **Diseño** | Modo claro/oscuro, glassmorphism sutil, Framer Motion, microinteracciones, mobile-first, componentes estilo shadcn/ui |

## 📁 Estructura

```
prisma/schema.prisma        # Esquema PostgreSQL completo (18 modelos)
src/
├── app/
│   ├── page.tsx            # Landing
│   ├── buscar/             # Buscador avanzado
│   ├── complejos/[slug]/   # Página del complejo (SSG + JSON-LD)
│   ├── reservar/[slug]/    # Wizard de reserva + Server Action
│   ├── reserva/[code]/     # Confirmación con QR
│   ├── dashboard/          # Panel del usuario
│   ├── admin/              # Panel del complejo (SaaS)
│   ├── login/ registro/    # Auth (UI lista para Clerk)
│   ├── api/                # disponibilidad + webhook Mercado Pago
│   └── sitemap.ts robots.ts manifest.ts
├── components/
│   ├── ui/                 # Design system (button, card, badge, tabs…)
│   ├── landing/ search/ venue/ booking/ admin/
│   └── navbar, footer, theme, motion
└── lib/
    ├── data/               # Capa de datos (tipos, seed, disponibilidad, reservas)
    ├── payments/           # Integración Mercado Pago + confirmaciones
    └── utils.ts            # cn, formato ARS/fechas
```

## 🗄️ Base de datos

El esquema completo con 18 modelos (usuarios, complejos, canchas, reservas, pagos, facturas, opiniones, cupones, equipos, torneos, notificaciones, lista de espera, multi-sucursal) está en [`prisma/schema.prisma`](prisma/schema.prisma) y las relaciones explicadas en [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md).

Puntos clave:
- `@@unique([fieldId, date, startHour])` en `Booking` — **imposible el doble-booking a nivel DB**.
- `Payment` separado de `Booking` — soporta seña + saldo + reintegros.
- `WaitlistEntry` — notificación automática cuando se libera un turno.
- `Organization → Venue` — panel multi-sucursal.

## ⚡ Performance

- Server Components por defecto; JS de cliente solo donde hay interacción.
- First Load JS ≈ 130–180 kB por ruta; gráficos en SVG propio (sin librerías de charts pesadas).
- Páginas de complejos pre-renderizadas (SSG) con `generateStaticParams`.
- Visuales de canchas generadas por CSS/SVG: cero imágenes remotas bloqueantes.
- `prefers-reduced-motion` respetado en todas las animaciones.

## 🔌 Modo demo vs. producción

| Capa | Demo (este repo, sin claves) | Producción |
|---|---|---|
| Datos | Seed en memoria (`src/lib/data`) | PostgreSQL + Prisma (mismo contrato) |
| Auth | UI de login/registro | Clerk (Google, Apple, email, recovery) |
| Pagos | Aprobación simulada | Mercado Pago Checkout Pro + webhook firmado |
| Notificaciones | No-op | Resend (email) + WhatsApp Cloud API |

La arquitectura completa, los wireframes y el detalle del sistema de diseño están en [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md).
