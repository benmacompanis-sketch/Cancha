import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://coverfc.com.ar";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Cover FC — Canchas de fútbol techadas en Almagro",
    template: "%s · Cover FC",
  },
  description:
    "Club deportivo en Almagro (Yatay 556) con canchas techadas de fútbol 5 en césped sintético y fútbol 8. Reservá online con disponibilidad en tiempo real. Buffet, parrilla, vestuarios, estacionamiento, escuelita de fútbol y cumpleaños.",
  keywords: [
    "cancha de fútbol Almagro",
    "alquiler cancha fútbol 5",
    "fútbol 5 Almagro",
    "cancha techada Buenos Aires",
    "Cover FC",
    "reservar cancha online",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Cover FC",
    title: "Cover FC — Canchas de fútbol techadas en Almagro",
    description:
      "Canchas techadas de F5 y F8 en Yatay 556. Reservá online en 30 segundos.",
    url: APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Cover FC — Canchas techadas en Almagro",
    description: "Reservá online en 30 segundos, sin llamadas ni vueltas.",
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
  name: "Cover FC",
  alternateName: "Cover Fútbol 5",
  url: APP_URL,
  logo: `${APP_URL}/icon.svg`,
  description:
    "Club deportivo en Almagro con canchas techadas de fútbol 5 y fútbol 8, reservas online, buffet, escuelita de fútbol y cumpleaños.",
  telephone: "+54 11 4862-3880",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Yatay 556",
    addressLocality: "Almagro, Buenos Aires",
    postalCode: "C1184",
    addressCountry: "AR",
  },
  openingHours: "Mo-Su 10:00-24:30",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.2,
    reviewCount: 97,
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
