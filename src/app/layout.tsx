import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://labombonerita.com.ar";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "La Bombonerita — Canchas de fútbol en Caballito",
    template: "%s · La Bombonerita",
  },
  description:
    "Complejo de fútbol en Caballito con 4 canchas de césped sintético (F5, F7 y F8), techadas y descubiertas. Reservá online con disponibilidad en tiempo real, pagá con Mercado Pago y recibí tu QR al instante.",
  keywords: [
    "cancha de fútbol Caballito",
    "alquiler cancha fútbol 5",
    "fútbol 5 Caballito",
    "complejo deportivo Caballito",
    "reservar cancha online",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "La Bombonerita",
    title: "La Bombonerita — Canchas de fútbol en Caballito",
    description:
      "4 canchas de sintético profesional. Reservá online en 30 segundos, sin llamadas ni WhatsApp.",
    url: APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "La Bombonerita — Canchas de fútbol en Caballito",
    description:
      "Reservá online en 30 segundos, sin llamadas ni WhatsApp.",
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
  "@type": "SportsActivityLocation",
  name: "La Bombonerita",
  url: APP_URL,
  logo: `${APP_URL}/icon.svg`,
  description:
    "Complejo de canchas de fútbol 5, 7 y 8 en Caballito con reservas online.",
  telephone: "+54 11 4901-2233",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Rivadavia 5340",
    addressLocality: "Caballito, Buenos Aires",
    addressCountry: "AR",
  },
  openingHours: "Mo-Su 09:00-24:00",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.9,
    reviewCount: 482,
  },
  priceRange: "$$",
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
