"use client";

import { motion } from "framer-motion";

/** Gráfico de área (ingresos) — SVG liviano, sin librerías pesadas. */
export function AreaChart({
  data,
  height = 180,
}: {
  data: { date: string; value: number }[];
  height?: number;
}) {
  const w = 600;
  const h = height;
  const pad = 8;
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const pts = data.map((d, i) => ({
    x: pad + (i * (w - pad * 2)) / (data.length - 1),
    y: h - pad - (d.value / max) * (h - pad * 2),
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${h} L${pts[0].x},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Ingresos últimos 14 días">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#areaFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="4.5" fill="var(--primary)" />
    </svg>
  );
}

/** Gráfico de barras (ocupación por hora). */
export function BarChart({ data }: { data: { hour: string; value: number }[] }) {
  return (
    <div className="flex h-44 items-end gap-2">
      {data.map((d, i) => (
        <div key={d.hour} className="flex flex-1 flex-col items-center gap-1.5">
          <motion.div
            className="w-full rounded-t-lg bg-primary/80"
            style={{ minHeight: 4 }}
            initial={{ height: 0 }}
            animate={{ height: `${d.value}%` }}
            transition={{ duration: 0.6, delay: i * 0.04, ease: "easeOut" }}
          />
          <span className="text-[10px] text-muted-foreground">{d.hour}h</span>
        </div>
      ))}
    </div>
  );
}

/** Donut (distribución de ingresos por cancha). */
export function DonutChart({ data }: { data: { name: string; value: number }[] }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  const colors = ["var(--primary)", "#0ea5e9", "#f59e0b", "#a855f7"];
  let acc = 0;
  const r = 40;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="size-36 -rotate-90">
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = `${frac * c} ${c}`;
          const offset = -acc * c;
          acc += frac;
          return (
            <motion.circle
              key={d.name}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth="14"
              strokeDasharray={dash}
              strokeDashoffset={offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            />
          );
        })}
      </svg>
      <ul className="space-y-2">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2 text-sm">
            <span
              className="size-2.5 rounded-full"
              style={{ background: colors[i % colors.length] }}
            />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-semibold">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
