import type { NextConfig } from "next";

// STATIC_EXPORT=1 genera el sitio estático para GitHub Pages
// (ver .github/workflows/deploy-pages.yml). Sin esa variable,
// build estándar con SSR/API para Vercel o Node.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
