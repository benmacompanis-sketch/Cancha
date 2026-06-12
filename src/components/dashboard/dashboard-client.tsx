"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Flame,
  Heart,
  QrCode,
  Receipt,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { demoUser, getUserBookings } from "@/lib/data/user";
import { getClientBookings } from "@/lib/data/client-store";
import { formatARS, formatDateShort, toISODate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeIn } from "@/components/motion";

const STATUS_BADGE: Record<string, { label: string; variant: "success" | "secondary" | "destructive" }> = {
  confirmada: { label: "Confirmada", variant: "success" },
  jugada: { label: "Jugada", variant: "secondary" },
  cancelada: { label: "Cancelada", variant: "destructive" },
  pendiente: { label: "Pendiente", variant: "secondary" },
};

export function DashboardClient() {
  // Reservas vivas desde localStorage: el dashboard funciona en
  // hosting estático y refleja lo que el visitante reservó en el demo.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const { upcoming, history } = React.useMemo(
    () => getUserBookings(mounted ? getClientBookings() : []),
    [mounted]
  );
  const today = toISODate(new Date());
  const s = demoUser.stats;

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
        <Skeleton className="h-16 w-72" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <FadeIn>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-premium">
              {demoUser.avatar}
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Hola, {demoUser.name.split(" ")[0]} 👋
              </h1>
              <p className="text-muted-foreground">
                Ranking #{demoUser.ranking} de tu zona · {demoUser.points} puntos
              </p>
            </div>
          </div>
          <Link href="/reservar">
            <Button>Reservar otro partido</Button>
          </Link>
        </div>
      </FadeIn>

      {/* estadísticas personales */}
      <FadeIn delay={1}>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { icon: CalendarDays, label: "Partidos", value: s.played },
            { icon: Target, label: "Goles", value: s.goals },
            { icon: Users, label: "Asistencias", value: s.assists },
            { icon: Trophy, label: "MVP", value: s.mvp },
            { icon: Star, label: "Victorias", value: `${Math.round(s.winRate * 100)}%` },
            { icon: Flame, label: "Racha", value: `${s.streak} 🔥` },
          ].map((stat) => (
            <Card key={stat.label} className="p-4">
              <stat.icon className="size-4 text-primary" />
              <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={2}>
        <Tabs defaultValue="proximos" className="mt-10">
          <TabsList className="flex-wrap">
            <TabsTrigger value="proximos">Próximos</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="equipos">Equipos</TabsTrigger>
            <TabsTrigger value="facturas">Facturas</TabsTrigger>
          </TabsList>

          <TabsContent value="proximos">
            <div className="grid gap-4 lg:grid-cols-2">
              {upcoming.map((b) => (
                <Card key={b.id} className="overflow-hidden">
                  <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/50 px-5 py-3">
                    <p className="font-semibold">{b.venueName}</p>
                    <Badge variant={STATUS_BADGE[b.status].variant}>
                      {STATUS_BADGE[b.status].label}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-4" />
                        {b.date === today
                          ? "Hoy"
                          : formatDateShort(new Date(b.date + "T12:00:00"))}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-4" />
                        {b.hour}:00 hs
                      </span>
                      <span>{b.fieldName}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm">
                        <span className="font-bold">{formatARS(b.price)}</span>
                        {b.paymentKind === "seña" && (
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            (seña pagada: {formatARS(b.paidAmount)})
                          </span>
                        )}
                      </p>
                      <div className="flex gap-2">
                        <Link href={`/reserva?code=${b.code}`}>
                          <Button variant="outline" size="sm">
                            <QrCode />
                            Ver QR
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          Reagendar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {upcoming.length === 0 && (
                <p className="text-muted-foreground">No tenés partidos próximos.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="historial">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
              {history.map((b, i) => (
                <div
                  key={b.id}
                  className={`flex flex-wrap items-center gap-3 px-5 py-4 ${
                    i > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{b.venueName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateShort(new Date(b.date + "T12:00:00"))} · {b.hour}:00 ·{" "}
                      {b.fieldName}
                    </p>
                  </div>
                  <Badge variant={STATUS_BADGE[b.status].variant}>
                    {STATUS_BADGE[b.status].label}
                  </Badge>
                  <p className="w-24 text-right font-semibold">{formatARS(b.price)}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="equipos">
            <div className="grid gap-4 sm:grid-cols-2">
              {demoUser.teams.map((t) => (
                <Card key={t.id}>
                  <CardHeader className="flex-row items-center gap-4 space-y-0">
                    <span
                      className="flex size-12 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-premium"
                      style={{ background: t.color }}
                    >
                      {t.name[0]}
                    </span>
                    <div>
                      <CardTitle>{t.name}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t.role} · {t.members} jugadores
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Users />
                        Invitar
                      </Button>
                      <Button variant="ghost" size="sm">
                        Ver plantel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card className="flex items-center justify-center border-dashed p-8">
                <Button variant="ghost">+ Crear nuevo equipo</Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="facturas">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
              {history
                .filter((b) => b.status !== "cancelada")
                .map((b, i) => (
                  <div
                    key={b.id}
                    className={`flex items-center gap-3 px-5 py-4 ${
                      i > 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <Receipt className="size-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        Factura {b.code.replace("CN-", "FC-")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.venueName} · {formatDateShort(new Date(b.date + "T12:00:00"))}
                      </p>
                    </div>
                    <p className="font-semibold">{formatARS(b.paidAmount)}</p>
                    <Button variant="ghost" size="sm">
                      PDF
                    </Button>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </FadeIn>

      {/* favoritos rápidos / referidos */}
      <FadeIn delay={3}>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <Card className="bg-gradient-to-br from-primary to-emerald-700 text-white">
            <CardContent className="p-6">
              <Heart className="size-5" />
              <h3 className="mt-3 text-lg font-bold">Invitá amigos, jugá gratis</h3>
              <p className="mt-1 text-sm text-white/85">
                Por cada amigo que reserve con tu código sumás 500 puntos.
              </p>
              <div className="mt-4 inline-flex items-center gap-3 rounded-xl bg-white/15 px-4 py-2 font-mono font-bold tracking-widest">
                {demoUser.referralCode}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Trophy className="size-5 text-primary" />
              <h3 className="mt-3 text-lg font-bold">Torneo Clausura F5 · Inscripción abierta</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Arranca el 5 de julio en La Bombonerita. Premio: $500.000 + trofeo.
              </p>
              <Button className="mt-4" size="sm">
                Inscribir a Los Pibes FC
              </Button>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </div>
  );
}
