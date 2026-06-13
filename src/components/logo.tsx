import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Escudo de Cover FC (versión vectorial simplificada del crest real):
 * escudo almenado verde y blanco, franja diagonal y estrella amarilla.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex size-9 items-center justify-center", className)}>
      <svg viewBox="0 0 64 72" className="h-full w-auto drop-shadow-sm" aria-hidden>
        {/* escudo con almenas */}
        <path
          d="M8 6 H20 V13 H27 V6 H37 V13 H44 V6 H56 V40 C56 54 45 62.5 32 67.5 C19 62.5 8 54 8 40 Z"
          fill="#43a047"
          stroke="#161616"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* banda blanca superior */}
        <rect x="11" y="16" width="42" height="9" rx="1.5" fill="#fff" stroke="#161616" strokeWidth="1.6" />
        {/* interior blanco */}
        <path
          d="M13 28 H51 V39 C51 50 42.5 56.5 32 60.8 C21.5 56.5 13 50 13 39 Z"
          fill="#fff"
        />
        {/* franja diagonal */}
        <path d="M13 47 L51 28 V36.5 L17.5 53.5 Z" fill="#43a047" />
        {/* estrella */}
        <path
          d="M22.5 32.5 l1.5 3.1 3.4 .4 -2.5 2.3 .65 3.35 -3.05 -1.65 -3.05 1.65 .65 -3.35 -2.5 -2.3 3.4 -.4 Z"
          fill="#fbbf24"
          stroke="#d99e07"
          strokeWidth="0.6"
        />
      </svg>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 font-semibold tracking-tight", className)}
    >
      <LogoMark />
      <span className="text-lg font-bold uppercase tracking-wide">Cover FC</span>
    </Link>
  );
}
