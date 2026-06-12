import { cn } from "@/lib/utils";

/**
 * Visual vectorial de una cancha de fútbol vista desde arriba.
 * Reemplaza fotos externas en el demo: cada cancha tiene su tono (hue)
 * para que la grilla se sienta viva sin depender de assets remotos.
 */
export function FieldVisual({
  hue = 145,
  className,
  label,
}: {
  hue?: number;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `linear-gradient(160deg, hsl(${hue} 55% 34%), hsl(${hue} 65% 22%))`,
      }}
    >
      {/* franjas de césped */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          background: `repeating-linear-gradient(90deg, transparent 0 12%, rgba(255,255,255,0.5) 12% 24%)`,
        }}
      />
      {/* líneas de la cancha */}
      <svg
        viewBox="0 0 200 120"
        className="absolute inset-0 h-full w-full opacity-50"
        aria-hidden
        preserveAspectRatio="none"
      >
        <g stroke="white" strokeWidth="1.5" fill="none">
          <rect x="10" y="10" width="180" height="100" rx="2" />
          <line x1="100" y1="10" x2="100" y2="110" />
          <circle cx="100" cy="60" r="16" />
          <rect x="10" y="35" width="24" height="50" />
          <rect x="166" y="35" width="24" height="50" />
        </g>
      </svg>
      {label && (
        <span className="absolute bottom-2 left-3 text-xs font-semibold text-white/90 drop-shadow">
          {label}
        </span>
      )}
    </div>
  );
}
