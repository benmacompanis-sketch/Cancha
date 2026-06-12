"use client";

import * as React from "react";
import { getAdminSettings } from "@/lib/data/admin-store";
import { formatARS } from "@/lib/utils";

/**
 * Precio por hora de una cancha respetando el override configurado
 * en el panel de admin (se actualiza tras el mount; el SSR muestra
 * el precio base).
 */
export function FieldPrice({
  fieldId,
  basePrice,
}: {
  fieldId: string;
  basePrice: number;
}) {
  const [price, setPrice] = React.useState(basePrice);

  React.useEffect(() => {
    setPrice(getAdminSettings().fieldPrices[fieldId] ?? basePrice);
  }, [fieldId, basePrice]);

  return (
    <p className="text-sm text-muted-foreground">
      <span className="text-lg font-bold text-foreground">{formatARS(price)}</span>{" "}
      / hora
    </p>
  );
}
