import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://cancha.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Cancha — Reservá tu cancha de fútbol en segundos",
    template: "%s · Cancha",
  },
  description:
    "Encontrá disponibilidad en tiempo real y asegurá tu partido sin llamadas ni WhatsApp. Reservas online de canchas de fútbol 5, 7, 8 y 11 en toda Argentina.",
  keywords: [
    "reservar cancha de fútbol",
    "fútbol 5",
    "fútbol 7",
    "canchas Buenos Aires",
    "alquiler cancha",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Cancha",
    title: "Cancha — Reservá tu cancha de fútbol en segundos",
    description:
      "Disponibilidad en tiempo real, pago online y confirmación instantánea.",
    url: APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Cancha — Reservá tu cancha en segundos",
    description:
      "Disponibilidad en tiempo real, pago online y confirmación instantánea.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cancha",
  url: APP_URL,
  logo: `${APP_URL}/icon.svg`,
  description:
    "Plataforma de reservas online de canchas de fútbol en Argentina.",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
