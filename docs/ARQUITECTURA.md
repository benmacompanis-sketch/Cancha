# Arquitectura de Cancha

Documento de producto + ingeniería: arquitectura, diseño UX/UI, wireframes y modelo de datos.

---

## 1. Arquitectura general

```
                ┌──────────────────────────────────────────────┐
                │                   Vercel                     │
                │  ┌────────────────────────────────────────┐  │
 Usuario ──────▶│  │ Next.js 15 (App Router, RSC)           │  │
 (web/mobile)   │  │  · Páginas SSG/SSR + Server Actions    │  │
                │  │  · API Routes (REST + webhooks)        │  │
                │  └───────┬──────────────┬─────────────────┘  │
                └──────────┼──────────────┼────────────────────┘
                           │              │
              ┌────────────▼───┐   ┌──────▼───────────────────────┐
              │ PostgreSQL     │   │ Servicios externos           │
              │ (Neon/Supabase)│   │ · Clerk (auth)               │
              │ vía Prisma     │   │ · Mercado Pago (pagos)       │
              └────────────────┘   │ · Resend (email)             │
                                   │ · WhatsApp Cloud API         │
                                   │ · Web Push (notificaciones)  │
                                   └──────────────────────────────┘
```

**Decisiones clave**

| Decisión | Por qué |
|---|---|
| Server Components por defecto | HTML al instante, menos JS, Core Web Vitals altos |
| Server Actions para reservar | Mutación sin endpoint manual, sin recarga de página |
| Constraint único `(fieldId, date, startHour)` | El doble-booking es imposible aunque haya carrera entre dos usuarios |
| Pago como entidad separada | Seña + saldo + reintegros sin ensuciar la reserva |
| Disponibilidad calculada, no almacenada | Un turno está libre si no hay `Booking` activa: cero sincronización |
| Capa de datos con contrato estable (`src/lib/data`) | El modo demo (memoria) y producción (Prisma) son intercambiables |

**Escalabilidad a miles de usuarios simultáneos**: Vercel escala horizontalmente las funciones; PostgreSQL con PgBouncer/Neon serverless; lecturas de disponibilidad cacheables por segundos con `revalidate`; las escrituras son cortas y protegidas por el constraint único. Para tiempo real estricto se agrega Pusher/Ably emitiendo `slot.taken` por venue.

---

## 2. Diseño UX/UI

**Principios** (inspiración Apple / Stripe / Airbnb / Linear / Vercel):

1. **Una sola acción primaria por pantalla** — siempre verde, siempre obvia.
2. **Velocidad percibida** — animaciones de 200–350 ms, optimistic UI, skeletons.
3. **Densidad calma** — mucho aire, jerarquía tipográfica fuerte, sombras suaves de dos capas.
4. **Mobile-first** — el 80% de las reservas amateur se hacen desde el celular.

**Design tokens** (en `globals.css`, modo claro y oscuro):

- Color primario `#16a34a` (verde cancha) + acento lima `#84cc16`; superficies zinc.
- Radios 12–28 px; sombras `--shadow-premium(-lg)` de dos capas.
- Glassmorphism sutil (`.glass`): blur 16 px + saturación, solo en navbar, overlays y tarjetas flotantes.
- Tipografía: stack del sistema en demo; Geist/Inter vía `next/font` en producción.

**Microinteracciones**: `active:scale-95` en todo lo clickeable, hover-lift en cards, ping "en vivo" en badges de disponibilidad, barras/líneas de gráficos animadas al entrar, transiciones de paso del wizard con `AnimatePresence`.

---

## 3. Wireframes

### Landing
```
┌──────────────────────────────────────────────┐
│ ◉ Cancha   Explorar  Mis partidos  [Reservar]│
├──────────────────────────────────────────────┤
│  Badge "12.000 partidos/mes"                 │
│  RESERVÁ TU CANCHA          ┌─────────────┐  │
│  EN SEGUNDOS.               │  MOCKUP     │  │
│  Subtítulo                  │  ANIMADO    │  │
│  [Reservar ahora][Explorar] │  3 pasos    │  │
│  350+ · 98% · 4.9★          └─────────────┘  │
├──────────────────────────────────────────────┤
│  8 cards de beneficios (grid 4×2)            │
│  Cómo funciona (3 pasos)                     │
│  Complejos destacados (3 cards)              │
│  CTA final (gradiente verde)                 │
└──────────────────────────────────────────────┘
```

### Buscador
```
┌──────────────────────────────────────────────┐
│ [🔍 barrio/complejo ▾fecha ▾hora  (Filtros)] │ ← sticky glass
├───────────────────────────────┬──────────────┤
│ N complejos disponibles       │   MAPA       │
│ ┌─────────┐ ┌─────────┐       │   $28.000 ●  │
│ │VenueCard│ │VenueCard│       │      ● $30k  │
│ └─────────┘ └─────────┘       │  ● $25.000   │
│  (animación layout al filtrar)│  (pins sync  │
│                               │   con hover) │
└───────────────────────────────┴──────────────┘
```

### Página del complejo
```
┌──────────────────────────────────────────────┐
│ Nombre  ★4.9 (482) · dirección · horarios    │
│ ┌────────────┬─────┬─────┐                   │
│ │  galería   │ img │ img │                   │
│ │  principal ├─────┼─────┤                   │
│ │            │ img │▶vid │                   │
│ └────────────┴─────┴─────┘                   │
│ Descripción / Canchas / Servicios /          │ ┌─ sticky ─────┐
│ Ubicación / Opiniones                        │ │ DISPONIBILIDAD│
│                                              │ │ [Hoy][Mañ]…  │
│                                              │ │ [Cancha 1▾]  │
│                                              │ │ 18 19 2̶0̶ 21  │
│                                              │ └──────────────┘
└──────────────────────────────────────────────┘
```

### Wizard de reserva (sin recargas)
```
Cancha ▸ Fecha ▸ Horario ▸ Pago
[━━━━][━━━━][────][────]
Paso 4: resumen + nombre/email + MP/tarjeta/transf.
+ seña 30% o total → [Pagar $X y confirmar]
→ /reserva/CN-XXXX: ✓ ticket + QR + "enviado por WhatsApp/email"
```

### Dashboards
```
Usuario: header avatar+ranking → 6 stats → tabs
 (Próximos | Historial | Favoritos | Equipos | Facturas)
 → cards referidos + torneo

Admin: selector sucursal + exportar → 4 KPIs →
 [Área ingresos 14d][Donut por cancha]
 [Barras ocupación][Agenda live del día]
 → tabla clientes frecuentes
```

---

## 4. Modelo de datos — relaciones

Esquema completo en [`prisma/schema.prisma`](../prisma/schema.prisma).

```
Organization 1─N Venue 1─N Field 1─N Booking N─1 User
                   │           │        │
                   │           │        ├─1─N Payment
                   │           │        ├─1─1 Invoice
                   │           │        └─1─1 Review (solo tras jugar)
                   │           └─1─N PriceRule (precio por franja/día)
                   ├─1─N Review
                   ├─1─N Coupon ──1─N CouponRedemption N─1 User
                   ├─1─N Tournament ─1─N TournamentEntry N─1 Team
                   │                 └─1─N TournamentMatch (home/away Team)
                   └─N─N User (Favorite)

User 1─N Notification (EMAIL | WHATSAPP | PUSH)
User 1─N WaitlistEntry N─1 Field   ← lista de espera por turno
User N─1 User (referredBy)         ← programa de referidos
Team 1─N TeamMember N─1 User       ← rol + stats (goles, asistencias, MVP)
Booking 1─1 Booking (reschedule)   ← reagendamientos auditables
```

**Reglas de negocio en el esquema**

- **Anti doble-booking**: `@@unique([fieldId, date, startHour])` en `Booking`. Si dos usuarios pagan el mismo turno a la vez, la segunda inserción falla y se reembolsa automáticamente.
- **Reseñas verificadas**: `Review.bookingId @unique` — solo se puede opinar sobre un partido jugado, una vez.
- **Señas**: `Payment.kind` (`DEPOSIT`/`FULL`/`BALANCE`) permite registrar seña online y saldo en el complejo.
- **Cancelaciones/reagendamientos**: estados `CANCELLED`/`RESCHEDULED` + relación reflexiva `rescheduledFrom/To` mantienen el historial completo.
- **Lista de espera**: al cancelarse una reserva, se notifica por orden de llegada a los `WaitlistEntry` de ese turno.
- **Puntos y ranking**: `User.points` se incrementa por reserva jugada/referido; el ranking es una query ordenada con índice.

---

## 5. Flujo de reserva end-to-end (producción)

```
1. Usuario elige turno   → Server Action `createBooking`
2. Re-chequeo de disponibilidad (query + constraint único)
3. Booking en estado PENDING_PAYMENT + Payment PENDING
4. Mercado Pago: se crea preference → redirect a Checkout Pro
5. Webhook /api/webhooks/mercadopago (firma verificada)
   → Payment APPROVED → Booking CONFIRMED
6. Efectos: Invoice generada · QR token · email (Resend) ·
   WhatsApp (Cloud API) · Notification PUSH · puntos al usuario
7. Día del partido: check-in escaneando QR en el complejo
```

En **modo demo** los pasos 4–6 se simulan de forma síncrona para poder recorrer el flujo completo sin credenciales.

---

## 6. SEO y performance

- **Metadata dinámica** por complejo (`generateMetadata`), Open Graph y Twitter Cards.
- **JSON-LD**: `Organization` global + `SportsActivityLocation` (con `aggregateRating`) por complejo.
- **sitemap.xml / robots.txt / manifest** generados por código; rutas privadas excluidas.
- **URLs amigables**: `/complejos/la-bombonerita`, `/buscar`, `/reserva/CN-XXXX`.
- **Objetivo Lighthouse 95+**: SSG en páginas públicas, SVG en lugar de imágenes pesadas, charts propios (~2 kB vs ~100 kB de una librería), JS de cliente solo en islas interactivas, `prefers-reduced-motion`.
