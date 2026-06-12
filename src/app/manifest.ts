export const dynamic = "force-static";

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "La Bombonerita — Canchas de fútbol en Caballito",
    short_name: "La Bombonerita",
    description:
      "Reservá tu cancha online con disponibilidad en tiempo real.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#16a34a",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
