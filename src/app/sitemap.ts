export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { venues } from "@/lib/data/venues";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://cancha.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: APP_URL, changeFrequency: "daily", priority: 1 },
    { url: `${APP_URL}/buscar`, changeFrequency: "hourly", priority: 0.9 },
    ...venues.map((v) => ({
      url: `${APP_URL}/complejos/${v.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
