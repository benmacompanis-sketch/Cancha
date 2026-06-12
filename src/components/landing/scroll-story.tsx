"use client";

/**
 * Experiencia cinematográfica controlada por el scroll.
 *
 * Un único contenedor de 900vh con un escenario sticky de 100dvh.
 * El progreso global del scroll (0–1) se reparte en 8 escenas; cada
 * transformación (zoom, parallax, blur, morphing) está mapeada
 * directamente al scroll con useTransform: el usuario "maneja la
 * cámara" con el dedo. Sin GSAP: Framer Motion hace el scrubbing
 * nativo y mantiene el bundle liviano.
 */

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type P = MotionValue<number>;

type Range = [number, number];

/* Límites de cada escena sobre el progreso global (con solapes para crossfade) */
const SC: Record<
  "aerial" | "gate" | "path" | "grass" | "match" | "slots" | "reserve" | "confirm",
  Range
> = {
  aerial: [0.0, 0.15],
  gate: [0.12, 0.28],
  path: [0.26, 0.43],
  grass: [0.41, 0.56],
  match: [0.54, 0.7],
  slots: [0.68, 0.81],
  reserve: [0.79, 0.91],
  confirm: [0.885, 1.0],
};

/** Opacidad 0→1→1→0 dentro de un rango (entrada y salida suaves). */
function useFade(p: P, [a, b]: Range, inDur = 0.025, outDur = 0.025) {
  return useTransform(p, [a, a + inDur, b - outDur, b], [0, 1, 1, 0]);
}

/* ─────────────────────────── Piezas SVG reutilizables ─────────────────────────── */

function FieldLines({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#10401f" stroke="#2c6b3f" strokeWidth="2" />
      <rect x={x} y={y} width={w / 2} height={h} fill="#0e3a1c" rx={6} />
      <g stroke="rgba(255,255,255,0.55)" strokeWidth="2" fill="none">
        <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx={3} />
        <line x1={x + w / 2} y1={y + 6} x2={x + w / 2} y2={y + h - 6} />
        <circle cx={x + w / 2} cy={y + h / 2} r={Math.min(w, h) * 0.13} />
        <rect x={x + 6} y={y + h * 0.3} width={w * 0.1} height={h * 0.4} />
        <rect x={x + w - 6 - w * 0.1} y={y + h * 0.3} width={w * 0.1} height={h * 0.4} />
      </g>
      {/* torres de iluminación encendidas */}
      {[
        [x + 10, y + 10],
        [x + w - 10, y + 10],
        [x + 10, y + h - 10],
        [x + w - 10, y + h - 10],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={16} fill="url(#glow)" />
          <circle cx={cx} cy={cy} r={2.5} fill="#ffe9a8" />
        </g>
      ))}
    </g>
  );
}

function AerialComplex() {
  return (
    <svg viewBox="0 0 900 620" className="h-auto w-full" aria-hidden>
      <defs>
        <radialGradient id="glow">
          <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* predio */}
      <rect x="30" y="20" width="840" height="580" rx="30" fill="#0b120d" stroke="#1c2a20" strokeWidth="3" />
      {/* calles internas */}
      <path d="M450 20 V600" stroke="#141f17" strokeWidth="20" />
      <path d="M30 320 H870" stroke="#141f17" strokeWidth="16" />
      {/* canchas */}
      <FieldLines x={70} y={60} w={340} h={210} />
      <FieldLines x={490} y={60} w={340} h={210} />
      <FieldLines x={70} y={360} w={340} h={200} />
      {/* buffet + vestuarios */}
      <rect x="500" y="370" width="220" height="100" rx="10" fill="#1b2530" />
      <rect x="500" y="370" width="220" height="14" rx="7" fill="#26333f" />
      <text x="610" y="428" textAnchor="middle" fill="#9fb4c4" fontSize="22" fontWeight="700" letterSpacing="4">
        BUFFET
      </text>
      {/* estacionamiento */}
      <g fill="#202b26">
        <rect x="500" y="490" width="340" height="86" rx="10" />
      </g>
      <g fill="#39505e">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={516 + i * 54} y={508} width={34} height={50} rx={6} />
        ))}
      </g>
      {/* árboles */}
      <g fill="#11281a">
        {[
          [52, 44], [452, 44], [858, 48], [52, 312], [868, 318],
          [50, 590], [452, 588], [866, 590], [760, 330], [452, 330],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 22 : 16} />
        ))}
      </g>
      {/* portón de entrada */}
      <rect x="430" y="592" width="40" height="14" rx="3" fill="#d9b86a" />
    </svg>
  );
}

function PlayerSilhouette({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="-14 -34 28 66" className="h-full w-auto" aria-hidden>
      <g fill="#06110a" transform={flip ? "scale(-1,1)" : undefined}>
        <circle cx="0" cy="-26" r="6.5" />
        <path d="M-6 -17 L7 -15 L10 -2 L6 0 L3 -8 L4 8 L10 28 L4.5 30 L-1 12 L-4 30 L-9.5 28 L-5 6 Z" />
      </g>
    </svg>
  );
}

/* ─────────────────────────── Escena 1 · Vista aérea ─────────────────────────── */

function SceneAerial({ p }: { p: P }) {
  const opacity = useFade(p, SC.aerial, 0, 0.03);
  const scale = useTransform(p, SC.aerial, [1, 2.6]);
  const rotate = useTransform(p, SC.aerial, [0, -5]);
  const y = useTransform(p, SC.aerial, ["0%", "14%"]);
  const titleOpacity = useTransform(p, [0, 0.06], [1, 0]);

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0">
      <motion.div
        style={{ scale, rotate, y }}
        className="absolute inset-0 flex items-center justify-center px-6"
      >
        <div className="w-full max-w-3xl">
          <AerialComplex />
        </div>
      </motion.div>
      <motion.div
        style={{ opacity: titleOpacity }}
        className="absolute inset-x-0 top-[16%] text-center"
      >
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80">
          Escena 1 · Llegando al complejo
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl text-balance px-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Tu próximo partido empieza acá.
        </h1>
        <p className="mt-4 text-sm text-white/60">
          Bajá para entrar al predio
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────── Escena 2 · El portón ─────────────────────────── */

function GlowOrb({ p, x, y, size, speed }: { p: P; x: string; y: string; size: number; speed: number }) {
  const oy = useTransform(p, SC.gate, [0, -180 * speed]);
  const o = useFade(p, SC.gate);
  return (
    <motion.span
      style={{ y: oy, opacity: o, left: x, top: y, width: size, height: size }}
      className="absolute rounded-full bg-amber-200/50 blur-md"
    />
  );
}

function SceneGate({ p }: { p: P }) {
  const opacity = useFade(p, SC.gate);
  const scale = useTransform(p, SC.gate, [0.8, 7]);
  const blur = useTransform(p, [SC.gate[0], SC.gate[1] - 0.04, SC.gate[1]], [0, 0, 8]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const bgScale = useTransform(p, SC.gate, [1, 1.6]);

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* fondo: siluetas de tinglados con luces */}
      <motion.div style={{ scale: bgScale }} className="absolute inset-0">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden>
          <rect width="1000" height="600" fill="#070d09" />
          <path d="M0 430 L130 350 L260 430 Z M260 430 L390 340 L520 430 Z M520 430 L660 355 L800 430 Z M800 430 L900 370 L1000 430 Z" fill="#0d1712" />
          <rect y="430" width="1000" height="170" fill="#0a120d" />
          {[120, 380, 650, 890].map((x, i) => (
            <g key={i}>
              <rect x={x} y={300} width={4} height={130} fill="#16241b" />
              <circle cx={x + 2} cy={296} r={26} fill="url(#glow2)" />
              <circle cx={x + 2} cy={296} r={4} fill="#ffe9a8" />
            </g>
          ))}
          <defs>
            <radialGradient id="glow2">
              <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* orbes de luz con parallax multicapa */}
      <GlowOrb p={p} x="12%" y="38%" size={18} speed={0.6} />
      <GlowOrb p={p} x="82%" y="30%" size={26} speed={1.1} />
      <GlowOrb p={p} x="64%" y="48%" size={14} speed={0.8} />

      {/* portón que atravesamos */}
      <motion.div
        style={{ scale, filter }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative flex h-[52vh] w-[min(78vw,640px)] items-start justify-between">
          <div className="h-full w-10 rounded-t-xl bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-2xl sm:w-14" />
          <div className="absolute inset-x-0 top-0 flex h-16 items-center justify-center rounded-2xl border border-emerald-400/30 bg-zinc-900/90 shadow-2xl">
            <span className="text-xl font-black tracking-[0.45em] text-emerald-300 sm:text-2xl">
              CANCHA
            </span>
          </div>
          <div className="h-full w-10 rounded-t-xl bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-2xl sm:w-14" />
        </div>
      </motion.div>

      <SceneCaption p={p} range={SC.gate} step="Escena 2" text="Entrás al predio. Las luces ya están encendidas." />
    </motion.div>
  );
}

/* ─────────────────────────── Escena 3 · El sendero ─────────────────────────── */

function SidePanel({ p, side, k }: { p: P; side: "left" | "right"; k: number }) {
  const sign = side === "left" ? -1 : 1;
  const x = useTransform(p, SC.path, [`${sign * 4}%`, `${sign * 70}%`]);
  const scale = useTransform(p, SC.path, [0.85, 1.9]);
  const o = useFade(p, SC.path);
  return (
    <motion.div
      style={{ x, scale, opacity: o, [side]: `${6 + k * 2}%`, top: `${30 + k * 6}%` }}
      className="absolute h-[34vh] w-[30vw] max-w-sm overflow-hidden rounded-xl border border-emerald-900/60 shadow-2xl"
    >
      <svg viewBox="0 0 200 120" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        <rect width="200" height="120" fill="#0f4020" />
        <rect width="100" height="120" fill="#0d3a1d" />
        <g stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" fill="none">
          <rect x="6" y="6" width="188" height="108" />
          <line x1="100" y1="6" x2="100" y2="114" />
          <circle cx="100" cy="60" r="15" />
        </g>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
    </motion.div>
  );
}

function LightPole({ p, side, k }: { p: P; side: "left" | "right"; k: number }) {
  const sign = side === "left" ? -1 : 1;
  const x = useTransform(p, SC.path, [`${sign * 2}%`, `${sign * (40 + k * 25)}%`]);
  const scale = useTransform(p, SC.path, [0.6 + k * 0.1, 2.4]);
  const o = useFade(p, SC.path);
  return (
    <motion.div
      style={{ x, scale, opacity: o, [side]: `${18 + k * 9}%` }}
      className="absolute bottom-[18%] flex flex-col items-center"
    >
      <span className="size-4 rounded-full bg-amber-200 shadow-[0_0_36px_14px_rgba(253,230,138,0.45)]" />
      <span className="h-[26vh] w-1 bg-zinc-700" />
    </motion.div>
  );
}

function ScenePath({ p }: { p: P }) {
  const opacity = useFade(p, SC.path);
  const walk = useTransform(p, SC.path, ["0px", "-560px"]);
  const playersScale = useTransform(p, SC.path, [0.5, 1.35]);
  const playersY = useTransform(p, SC.path, ["6%", "-2%"]);

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* cielo nocturno */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#0d1a12_0%,#05080a_60%)]" />

      {/* sendero en perspectiva: caminás al hacer scroll */}
      <div className="absolute inset-0" style={{ perspective: 700 }}>
        <motion.div
          style={{
            rotateX: 74,
            backgroundPositionY: walk,
            backgroundImage:
              "repeating-linear-gradient(0deg,#101810 0 70px,#0c130c 70px 140px), linear-gradient(90deg, transparent 0 43%, #1a241a 43% 57%, transparent 57%)",
          }}
          className="absolute left-1/2 top-[42%] h-[160vh] w-[170vw] -translate-x-1/2 origin-top"
        />
        <div className="absolute inset-x-0 top-[36%] h-[24vh] bg-gradient-to-b from-[#05080a] to-transparent" />
      </div>

      {/* canchas a los costados, pasando a distinta velocidad */}
      <SidePanel p={p} side="left" k={0} />
      <SidePanel p={p} side="right" k={1} />
      <LightPole p={p} side="left" k={0} />
      <LightPole p={p} side="right" k={0} />
      <LightPole p={p} side="left" k={1} />
      <LightPole p={p} side="right" k={1} />

      {/* jugadores entrenando a lo lejos */}
      <motion.div
        style={{ scale: playersScale, y: playersY }}
        className="absolute inset-x-0 top-[40%] flex justify-center gap-6"
      >
        <div className="h-16 opacity-70"><PlayerSilhouette /></div>
        <div className="h-14 opacity-50"><PlayerSilhouette flip /></div>
        <div className="h-16 opacity-60"><PlayerSilhouette /></div>
      </motion.div>

      <SceneCaption p={p} range={SC.path} step="Escena 3" text="Caminás entre las canchas. El partido te espera al fondo." />
    </motion.div>
  );
}

/* ─────────────────── Escena 4 · El alambrado y el césped ─────────────────── */

function SceneGrass({ p }: { p: P }) {
  const opacity = useFade(p, SC.grass);
  const [a, b] = SC.grass;
  const mid = (a + b) / 2;

  // alambrado: lo atravesamos
  const fenceScale = useTransform(p, [a, mid], [1, 16]);
  const fenceOpacity = useTransform(p, [a, a + 0.02, mid - 0.03, mid], [0, 1, 1, 0]);
  const fenceBlur = useTransform(p, [a, mid], [0, 10]);
  const fenceFilter = useMotionTemplate`blur(${fenceBlur}px)`;

  // césped: enfoque progresivo (focus pull)
  const grassBlur = useTransform(p, [a, mid, b - 0.03], [14, 14, 0]);
  const grassFilter = useMotionTemplate`blur(${grassBlur}px)`;
  const grassScale = useTransform(p, [mid, b], [1.5, 1]);
  const lineX = useTransform(p, [mid, b], ["-30%", "10%"]);

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* césped en primer plano */}
      <motion.div style={{ filter: grassFilter, scale: grassScale }} className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(88deg,#0c3a1a 0 7px,#0e421e 7px 13px,#0b3517 13px 22px), radial-gradient(ellipse at 30% 80%, rgba(190,255,200,0.10), transparent 50%)",
          }}
        />
        {/* línea de cal */}
        <motion.div
          style={{ x: lineX, rotate: -16 }}
          className="absolute left-1/4 top-0 h-[160%] w-[7vw] min-w-14 bg-white/85 shadow-[0_0_50px_rgba(255,255,255,0.3)]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65))]" />
      </motion.div>

      {/* alambrado */}
      <motion.div style={{ scale: fenceScale, opacity: fenceOpacity, filter: fenceFilter }} className="absolute inset-0">
        <svg className="h-full w-full" aria-hidden>
          <defs>
            <pattern id="fence" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path d="M0 23 H46 M23 0 V46" stroke="#46525c" strokeWidth="2.6" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fence)" />
          <rect width="100%" height="14" y="4%" fill="#39434c" rx="6" />
        </svg>
      </motion.div>

      <SceneCaption p={p} range={SC.grass} step="Escena 4" text="Atravesás el alambrado. Pisás el césped. Ya estás adentro." />
    </motion.div>
  );
}

/* ─────────────────────────── Escena 5 · El partido ─────────────────────────── */

function MatchPlayer({ p, x, y, h, dir, drift }: { p: P; x: string; y: string; h: number; dir?: boolean; drift: number }) {
  const px = useTransform(p, SC.match, [0, drift]);
  return (
    <motion.div style={{ x: px, left: x, top: y, height: h }} className="absolute">
      <PlayerSilhouette flip={dir} />
    </motion.div>
  );
}

function SceneMatch({ p }: { p: P }) {
  const opacity = useFade(p, SC.match);
  const rotate = useTransform(p, SC.match, [2.5, -2.5]);
  const scale = useTransform(p, SC.match, [1.12, 1.02]);
  const ballX = useTransform(p, SC.match, ["-28vw", "30vw"]);
  const ballRotate = useTransform(p, SC.match, [0, 900]);
  const lightsOpacity = useTransform(p, [SC.match[0], SC.match[0] + 0.06], [0, 1]);

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 overflow-hidden bg-[#04070a]">
      <motion.div style={{ rotate, scale }} className="absolute inset-0">
        {/* campo en perspectiva desde adentro */}
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden>
          <rect width="1000" height="600" fill="#04070a" />
          <polygon points="-80,600 1080,600 770,235 230,235" fill="#0d3d1d" />
          <polygon points="-80,600 230,235 245,235 -20,600" fill="#0b3318" />
          <polygon points="1080,600 770,235 755,235 1020,600" fill="#0b3318" />
          {[0.18, 0.42, 0.66, 0.9].map((t) => {
            const y = 235 + t * 365;
            const inset = (1 - t) * 0.27;
            return (
              <line
                key={t}
                x1={230 + (770 - 230) * inset - 310 * t * inset}
                y1={y}
                x2={770 - (770 - 230) * inset + 310 * t * inset}
                y2={y}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="2"
              />
            );
          })}
          <g stroke="rgba(255,255,255,0.7)" strokeWidth="3" fill="none">
            <polygon points="-80,600 1080,600 770,235 230,235" />
            <ellipse cx="500" cy="560" rx="170" ry="46" />
            <line x1="120" y1="560" x2="880" y2="560" />
          </g>
          {/* arco al fondo */}
          <g stroke="#e8edf2" strokeWidth="5" fill="none">
            <path d="M420 235 V180 H580 V235" />
          </g>
          <g stroke="rgba(232,237,242,0.35)" strokeWidth="1">
            {[435, 455, 475, 495, 515, 535, 555, 565].map((x) => (
              <line key={x} x1={x} y1="182" x2={x} y2="233" />
            ))}
          </g>
        </svg>

        {/* jugadores */}
        <MatchPlayer p={p} x="22%" y="46%" h={70} drift={60} />
        <MatchPlayer p={p} x="64%" y="42%" h={58} dir drift={-80} />
        <MatchPlayer p={p} x="44%" y="36%" h={44} drift={40} />
        <MatchPlayer p={p} x="76%" y="55%" h={88} dir drift={-50} />

        {/* pelota rodando con el scroll */}
        <motion.div
          style={{ x: ballX, rotate: ballRotate }}
          className="absolute left-1/2 top-[63%] size-7 rounded-full bg-white shadow-[0_6px_18px_rgba(0,0,0,0.6)]"
        >
          <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-12 bg-zinc-900 [clip-path:polygon(50%_0,100%_38%,81%_100%,19%_100%,0_38%)]" />
        </motion.div>
      </motion.div>

      {/* reflectores que se encienden */}
      <motion.div style={{ opacity: lightsOpacity }} className="absolute inset-0">
        <div className="absolute -left-20 -top-24 h-[70vh] w-[55vw] rotate-[24deg] bg-[conic-gradient(from_115deg_at_0%_0%,rgba(255,244,200,0.22),transparent_28%)]" />
        <div className="absolute -right-20 -top-24 h-[70vh] w-[55vw] -rotate-[24deg] bg-[conic-gradient(from_200deg_at_100%_0%,transparent_72%,rgba(255,244,200,0.22))]" />
      </motion.div>

      <SceneCaption p={p} range={SC.match} step="Escena 5" text="Se encienden los reflectores. Rueda la pelota." />
    </motion.div>
  );
}

/* ──────────────── Escenas 6–7 · La cancha se vuelve interfaz ──────────────── */

const SLOT_HOURS = [
  { hour: "18:00", taken: true, k: 0.5 },
  { hour: "19:00", taken: false, k: 1.2 },
  { hour: "20:00", taken: false, k: 0.8, hero: true },
  { hour: "21:00", taken: true, k: 1.5 },
  { hour: "22:00", taken: false, k: 0.9 },
  { hour: "23:00", taken: false, k: 1.3 },
];

function FloatingSlot({ p, hour, taken, k, hero }: { p: P; hour: string; taken: boolean; k: number; hero?: boolean }) {
  const y = useTransform(p, SC.slots, [90 * k, -50 * k]);
  const o = useFade(p, [SC.slots[0], SC.slots[1] + (hero ? 0.1 : 0)]);
  // los no-elegidos se dispersan al entrar a la escena 7
  const scatter = useTransform(p, [SC.reserve[0], SC.reserve[0] + 0.05], [1, hero ? 1 : 0]);
  return (
    <motion.div
      style={{ y, opacity: hero ? o : scatter, scale: scatter }}
      className={
        taken
          ? "rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center backdrop-blur-sm"
          : "rounded-2xl border border-emerald-400/50 bg-emerald-500/15 px-6 py-4 text-center shadow-[0_0_34px_rgba(52,211,153,0.35)] backdrop-blur-sm"
      }
    >
      <p className={`text-lg font-bold ${taken ? "text-white/35 line-through" : "text-emerald-200"}`}>
        {hour}
      </p>
      <p className={`text-[11px] ${taken ? "text-white/25" : "text-emerald-300/80"}`}>
        {taken ? "Ocupado" : "Disponible"}
      </p>
    </motion.div>
  );
}

function SceneSlots({ p }: { p: P }) {
  const opacity = useFade(p, [SC.slots[0], SC.reserve[0] + 0.06]);
  const fieldScale = useTransform(p, SC.slots, [1.3, 1]);
  const fieldY = useTransform(p, SC.slots, ["10%", "0%"]);

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 overflow-hidden bg-[#04070a]">
      {/* la cancha, ahora vista elevada y atenuada: morphing a interfaz */}
      <motion.div style={{ scale: fieldScale, y: fieldY }} className="absolute inset-0 flex items-center justify-center opacity-40 blur-[2px]">
        <div className="w-full max-w-3xl px-8">
          <svg viewBox="0 0 200 120" className="h-auto w-full" aria-hidden>
            <rect width="200" height="120" rx="6" fill="#0d3a1c" />
            <g stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" fill="none">
              <rect x="5" y="5" width="190" height="110" rx="3" />
              <line x1="100" y1="5" x2="100" y2="115" />
              <circle cx="100" cy="60" r="16" />
            </g>
          </svg>
        </div>
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(4,7,10,0.8))]" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {SLOT_HOURS.map((s) => (
            <FloatingSlot key={s.hour} p={p} {...s} />
          ))}
        </div>
      </div>

      <SceneCaption p={p} range={SC.slots} step="Escena 6" text="La cancha se vuelve interfaz: los horarios libres brillan." />
    </motion.div>
  );
}

function SceneReserve({ p }: { p: P }) {
  const [a, b] = SC.reserve;
  const opacity = useFade(p, SC.reserve);
  const scale = useTransform(p, [a, a + 0.05], [0.55, 1]);
  const yCard = useTransform(p, [a, a + 0.05], [60, 0]);

  // morphing del botón: reservar → procesando → confirmada
  const t1 = a + 0.045; // empieza "procesando"
  const t2 = b - 0.035; // confirmada
  const labelO = useTransform(p, [a, t1 - 0.005, t1], [1, 1, 0]);
  const barO = useTransform(p, [t1, t1 + 0.005, t2 - 0.005, t2], [0, 1, 1, 0]);
  const barW = useTransform(p, [t1, t2], ["6%", "100%"]);
  const doneO = useTransform(p, [t2, t2 + 0.01], [0, 1]);
  const doneScale = useTransform(p, [t2, t2 + 0.015], [0.7, 1]);

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#04070a]/60">
      <motion.div
        style={{ scale, y: yCard }}
        className="mx-4 w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-950/90 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-emerald-300/70">
              Jueves · La Bombonerita
            </p>
            <p className="mt-1 text-3xl font-black text-white">20:00 hs</p>
            <p className="text-sm text-white/50">Cancha 1 · Fútbol 5 · Techada</p>
          </div>
          <p className="text-xl font-bold text-emerald-300">$28.000</p>
        </div>

        <div className="relative mt-6 h-12 overflow-hidden rounded-xl">
          <motion.div style={{ opacity: labelO }} className="absolute inset-0 flex items-center justify-center bg-emerald-500 font-semibold text-emerald-950">
            Reservar ahora
          </motion.div>
          <motion.div style={{ opacity: barO }} className="absolute inset-0 bg-zinc-800">
            <motion.div style={{ width: barW }} className="h-full bg-emerald-500/80" />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white/90">
              Procesando pago…
            </span>
          </motion.div>
          <motion.div style={{ opacity: doneO, scale: doneScale }} className="absolute inset-0 flex items-center justify-center gap-2 bg-emerald-400 font-bold text-emerald-950">
            ✓ Reserva confirmada
          </motion.div>
        </div>
        <p className="mt-3 text-center text-xs text-white/40">
          Seguís bajando, el sistema reserva por vos
        </p>
      </motion.div>

      <SceneCaption p={p} range={SC.reserve} step="Escena 7" text="Un gesto más y el turno es tuyo." />
    </motion.div>
  );
}

/* ─────────────────────────── Escena 8 · Confirmación ─────────────────────────── */

function SceneConfirm({ p }: { p: P }) {
  const [a] = SC.confirm;
  const opacity = useTransform(p, [a, a + 0.03], [0, 1]);
  const raysRotate = useTransform(p, [a, 1], [0, 18]);
  const flare = useTransform(p, [a, a + 0.06], [0, 1]);
  const y = useTransform(p, [a, a + 0.05], [50, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 overflow-hidden bg-[#04070a]">
      {/* el estadio se enciende */}
      <motion.div style={{ opacity: flare }} className="absolute inset-0">
        <div className="absolute -left-32 -top-32 size-[60vh] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -right-32 -top-24 size-[55vh] rounded-full bg-amber-200/15 blur-3xl" />
        <motion.div
          style={{ rotate: raysRotate }}
          className="absolute left-1/2 top-1/2 size-[160vmax] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0_18deg,rgba(52,211,153,0.05)_18deg_24deg,transparent_24deg_60deg,rgba(255,240,200,0.05)_60deg_66deg,transparent_66deg_120deg,rgba(52,211,153,0.05)_120deg_126deg,transparent_126deg_200deg,rgba(255,240,200,0.04)_200deg_208deg,transparent_208deg_300deg,rgba(52,211,153,0.05)_300deg_308deg,transparent_308deg)]"
        />
      </motion.div>

      <motion.div style={{ y }} className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80">
          Escena 8 · Confirmación
        </p>
        <h2 className="mt-5 max-w-3xl text-balance text-4xl font-black tracking-tight text-white sm:text-6xl">
          Tu partido está{" "}
          <span className="bg-gradient-to-r from-emerald-300 to-lime-300 bg-clip-text text-transparent">
            asegurado.
          </span>
        </h2>
        <p className="mt-4 max-w-md text-white/60">
          Jueves 20:00 · La Bombonerita · QR enviado por WhatsApp y email.
        </p>
        <div className="mt-6 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 font-mono text-sm font-bold tracking-[0.3em] text-white">
          CN-8F2K4A
        </div>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/buscar">
            <Button size="lg" className="bg-emerald-400 text-emerald-950 hover:bg-emerald-300 hover:brightness-100">
              Reservá el tuyo de verdad
              <ArrowRight />
            </Button>
          </Link>
          <Link href="/buscar">
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
              Explorar complejos
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────── Piezas de la experiencia ─────────────────────────── */

function SceneCaption({
  p,
  range,
  step,
  text,
}: {
  p: P;
  range: Range;
  step: string;
  text: string;
}) {
  const o = useFade(p, range, 0.04, 0.03);
  const y = useTransform(p, range, [24, -10]);
  return (
    <motion.div style={{ opacity: o, y }} className="absolute inset-x-0 bottom-[9%] px-6 text-center">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-300/70">
        {step}
      </p>
      <p className="mx-auto mt-1.5 max-w-md text-balance text-lg font-medium text-white/85">
        {text}
      </p>
    </motion.div>
  );
}

const SCENE_NAMES = [
  "Llegada",
  "El portón",
  "El sendero",
  "El césped",
  "El partido",
  "Horarios",
  "Reserva",
  "Confirmado",
];

function SceneDots({ scene }: { scene: number }) {
  return (
    <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-3 sm:flex">
      {SCENE_NAMES.map((name, i) => (
        <div key={name} className="flex items-center gap-2">
          <span
            className={`text-[10px] font-medium uppercase tracking-wider transition-all duration-300 ${
              i === scene ? "text-emerald-300 opacity-100" : "opacity-0"
            }`}
          >
            {name}
          </span>
          <span
            className={`rounded-full transition-all duration-300 ${
              i === scene ? "h-5 w-1.5 bg-emerald-400" : "size-1.5 bg-white/25"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

function ScrollHint({ p }: { p: P }) {
  const o = useTransform(p, [0, 0.035], [1, 0]);
  return (
    <motion.div
      style={{ opacity: o }}
      className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-1 text-white/60"
    >
      <span className="text-xs font-medium tracking-wide">Deslizá para entrar</span>
      <motion.span
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="size-5" />
      </motion.span>
    </motion.div>
  );
}

/* Fallback accesible: sin movimiento para prefers-reduced-motion */
function StaticHero() {
  return (
    <section className="flex min-h-[85vh] flex-col items-center justify-center bg-[#05080a] px-6 text-center">
      <h1 className="max-w-2xl text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl">
        Reservá tu cancha <span className="text-emerald-300">en segundos.</span>
      </h1>
      <p className="mt-5 max-w-lg text-lg text-white/60">
        Encontrá disponibilidad en tiempo real y asegurá tu partido sin
        llamadas ni WhatsApp.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/buscar">
          <Button size="lg">Reservar ahora</Button>
        </Link>
        <Link href="/buscar">
          <Button size="lg" variant="outline">Explorar complejos</Button>
        </Link>
      </div>
    </section>
  );
}

/* ─────────────────────────── Experiencia completa ─────────────────────────── */

export function ScrollStory() {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [scene, setScene] = React.useState(0);

  useMotionValueEvent(p, "change", (v) => {
    const starts = Object.values(SC).map(([a]) => a);
    let active = 0;
    starts.forEach((a, i) => {
      if (v >= a) active = i;
    });
    setScene(active);
  });

  if (reduced) return <StaticHero />;

  return (
    <div ref={ref} className="relative h-[900vh] bg-[#04070a]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        {/* cielo base con estrellas */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,#0c1a12_0%,#04070a_55%)]" />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.5) 50%, transparent 50%), radial-gradient(1px 1px at 38% 8%, rgba(255,255,255,0.4) 50%, transparent 50%), radial-gradient(1.5px 1.5px at 64% 14%, rgba(255,255,255,0.45) 50%, transparent 50%), radial-gradient(1px 1px at 86% 22%, rgba(255,255,255,0.35) 50%, transparent 50%), radial-gradient(1px 1px at 50% 28%, rgba(255,255,255,0.3) 50%, transparent 50%)",
          }}
        />

        <SceneAerial p={p} />
        <SceneGate p={p} />
        <ScenePath p={p} />
        <SceneGrass p={p} />
        <SceneMatch p={p} />
        <SceneSlots p={p} />
        <SceneReserve p={p} />
        <SceneConfirm p={p} />

        <SceneDots scene={scene} />
        <ScrollHint p={p} />
      </div>
    </div>
  );
}
