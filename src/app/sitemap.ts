export const dynamic = "force-static";

import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://labombonerita.com.ar";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: APP_URL, changeFrequency: "daily", priority: 1 },
    { url: `${APP_URL}/reservar`, changeFrequency: "hourly", priority: 0.9 },
  ];
}
