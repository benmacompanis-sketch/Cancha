"use client";

import * as React from "react";
import { Check, Power } from "lucide-react";
import { COMPANY } from "@/lib/data/company";
import { FIELD_TYPE_LABELS } from "@/lib/data/venues";
import { getAdminSettings, saveAdminSettings } from "@/lib/data/admin-store";
import { cn, formatARS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldVisual } from "@/components/venue/field-visual";

/** Gestión de precios por cancha y canchas activas/inactivas. */
export function AdminPricing() {
  const fields = COMPANY.venue.fields;
  const [prices, setPrices] = React.useState<Record<string, string>>({});
  const [inactive, setInactive] = React.useState<string[]>([]);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  React.useEffect(() => {
    const s = getAdminSettings();
    setPrices(
      Object.fromEntries(
        fields.map((f) => [f.id, String(s.fieldPrices[f.id] ?? f.pricePerHour)])
      )
    );
    setInactive(s.inactiveFields);
  }, [fields]);

  function save(fieldId: string) {
    const value = Math.max(0, Math.round(Number(prices[fieldId]) || 0));
    const s = getAdminSettings();
    saveAdminSettings({
      fieldPrices: { ...s.fieldPrices, [fieldId]: value },
    });
    setPrices((p) => ({ ...p, [fieldId]: String(value) }));
    setSavedAt(fieldId);
    setTimeout(() => setSavedAt(null), 1800);
  }

  function toggleActive(fieldId: string) {
    const next = inactive.includes(fieldId)
      ? inactive.filter((id) => id !== fieldId)
      : [...inactive, fieldId];
    setInactive(next);
    saveAdminSettings({ inactiveFields: next });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Los cambios se aplican al instante en la web pública: grilla de
        disponibilidad, página de reservas y precios de la portada.
      </p>

      {fields.map((f) => {
        const isInactive = inactive.includes(f.id);
        const baseChanged = Number(prices[f.id]) !== f.pricePerHour;
        return (
          <div
            key={f.id}
            className={cn(
              "flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-premium transition-opacity",
              isInactive && "opacity-60"
            )}
          >
            <FieldVisual hue={f.hue} className="h-14 w-24 shrink-0 rounded-xl" />
            <div className="min-w-36 flex-1">
              <p className="font-semibold">{f.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary">{FIELD_TYPE_LABELS[f.type]}</Badge>
                <Badge variant="secondary">
                  {f.roof === "techada" ? "Techada" : "Descubierta"}
                </Badge>
                {isInactive && <Badge variant="destructive">Deshabilitada</Badge>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  min={0}
                  step={500}
                  value={prices[f.id] ?? ""}
                  onChange={(e) =>
                    setPrices((p) => ({ ...p, [f.id]: e.target.value }))
                  }
                  className="w-32 pl-7 font-semibold"
                  aria-label={`Precio por hora de ${f.name}`}
                />
              </div>
              <span className="hidden text-xs text-muted-foreground sm:block">
                / hora
              </span>
              <Button size="sm" onClick={() => save(f.id)}>
                {savedAt === f.id ? (
                  <>
                    <Check />
                    Guardado
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
              <Button
                size="sm"
                variant={isInactive ? "default" : "outline"}
                onClick={() => toggleActive(f.id)}
                title={isInactive ? "Habilitar cancha" : "Deshabilitar cancha"}
              >
                <Power />
                {isInactive ? "Habilitar" : "Deshabilitar"}
              </Button>
            </div>

            {baseChanged && (
              <p className="w-full text-xs text-muted-foreground">
                Precio de lista original: {formatARS(f.pricePerHour)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
