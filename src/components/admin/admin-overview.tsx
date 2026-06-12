"use client";

import {
  ArrowUpRight,
  CalendarCheck,
  CircleDollarSign,
  Clock,
  Download,
  Gauge,
  UserPlus,
} from "lucide-react";
import { adminMetrics } from "@/lib/data/admin";
import { formatARS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, BarChart, DonutChart } from "@/components/admin/charts";
import { FadeIn } from "@/components/motion";

const STATUS_STYLE: Record<string, "success" | "warning" | "secondary"> = {
  confirmada: "success",
  seña: "warning",
  libre: "secondary",
};

export function AdminOverview() {
  const m = adminMetrics;

  return (
    <div>
      <FadeIn>
        <div className="flex justify-end">
          <Button variant="outline">
            <Download />
            Exportar reporte
          </Button>
        </div>
      </FadeIn>

      {/* ── KPIs ── */}
      <FadeIn delay={1}>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: CalendarCheck,
              label: "Reservas hoy",
              value: m.kpis.todayBookings,
              hint: `${m.kpis.freeSlotsToday} turnos aún libres`,
            },
            {
              icon: CircleDollarSign,
              label: "Ingresos hoy",
              value: formatARS(m.kpis.todayRevenue),
              hint: "Cobrado + señas",
            },
            {
              icon: Gauge,
              label: "Ocupación",
              value: `${Math.round(m.kpis.occupancy * 100)}%`,
              hint: "Promedio del día",
            },
            {
              icon: UserPlus,
              label: "Clientes nuevos",
              value: m.kpis.newClients,
              hint: "Últimos 30 días",
            },
          ].map((kpi) => (
            <Card key={kpi.label} className="p-5">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <kpi.icon className="size-4" />
                </span>
                <ArrowUpRight className="size-4 text-primary" />
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight">{kpi.value}</p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="mt-1 text-xs text-muted-foreground/70">{kpi.hint}</p>
            </Card>
          ))}
        </div>
      </FadeIn>

      {/* ── Gráficos ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <FadeIn delay={2} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Ingresos · últimos 14 días</CardTitle>
                <CardDescription>
                  {formatARS(m.kpis.monthRevenue)} este mes{" "}
                  <span className="font-semibold text-primary">
                    +{Math.round(m.kpis.monthRevenueDelta * 100)}%
                  </span>{" "}
                  vs. mes anterior
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <AreaChart data={m.revenueByDay} />
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={3}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Ingresos por cancha</CardTitle>
              <CardDescription>Participación del mes</CardDescription>
            </CardHeader>
            <CardContent>
              <DonutChart data={m.revenueByField} />
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <FadeIn delay={1}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Ocupación por horario</CardTitle>
              <CardDescription>% promedio semanal</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={m.occupancyByHour} />
            </CardContent>
          </Card>
        </FadeIn>

        {/* ── Agenda del día ── */}
        <FadeIn delay={2} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Reservas del día</CardTitle>
                <CardDescription>Agenda en tiempo real</CardDescription>
              </div>
              <Badge variant="live">
                <span className="relative flex size-1.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative size-1.5 rounded-full bg-primary" />
                </span>
                Live
              </Badge>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="divide-y divide-border border-t border-border">
                {m.todaySchedule.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 px-6 py-3.5">
                    <span className="flex w-14 items-center gap-1 font-mono text-sm font-semibold">
                      <Clock className="size-3.5 text-muted-foreground" />
                      {r.hour}h
                    </span>
                    <span className="w-24 text-sm text-muted-foreground">{r.field}</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {r.client}
                    </span>
                    <Badge variant={STATUS_STYLE[r.status]}>
                      {r.status === "libre" ? "Libre" : r.status === "seña" ? "Señado" : "Confirmada"}
                    </Badge>
                    <span className="hidden w-24 text-right text-sm font-semibold sm:block">
                      {r.amount ? formatARS(r.amount) : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* ── Clientes frecuentes ── */}
      <FadeIn delay={3}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Clientes frecuentes</CardTitle>
            <CardDescription>Mayor facturación · últimos 90 días</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="divide-y divide-border border-t border-border">
              {m.topClients.map((c, i) => (
                <div key={c.name} className="flex items-center gap-4 px-6 py-3.5">
                  <span className="w-6 text-center font-mono text-sm text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                    {c.name[0]}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">{c.name}</span>
                  <span className="hidden text-sm text-muted-foreground sm:block">
                    {c.bookings} reservas
                  </span>
                  <span className="font-semibold">{formatARS(c.spent)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
