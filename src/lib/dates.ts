import { addDays, toISODate } from "@/lib/utils";

export interface DateOption {
  iso: string;
  label: string;
}

/** Próximos `n` días con etiquetas amigables ("Hoy", "Mañana", "vie 14"). */
export function getUpcomingDates(n = 7): DateOption[] {
  return Array.from({ length: n }, (_, i) => {
    const d = addDays(new Date(), i);
    return {
      iso: toISODate(d),
      label:
        i === 0
          ? "Hoy"
          : i === 1
            ? "Mañana"
            : new Intl.DateTimeFormat("es-AR", {
                weekday: "short",
                day: "numeric",
              }).format(d),
    };
  });
}
