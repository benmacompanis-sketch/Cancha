import type { Venue } from "./types";

export const AMENITY_LABELS: Record<string, string> = {
  estacionamiento: "Estacionamiento",
  buffet: "Buffet y bar",
  vestuarios: "Vestuarios",
  parrilla: "Parrilla",
  wifi: "Wi-Fi",
  duchas: "Duchas",
  "iluminacion-led": "Iluminación LED",
  kiosco: "Kiosco",
};

export const FIELD_TYPE_LABELS: Record<string, string> = {
  F5: "Fútbol 5",
  F6: "Fútbol 6",
  F7: "Fútbol 7",
  F8: "Fútbol 8",
  F11: "Fútbol 11",
};

export const SURFACE_LABELS: Record<string, string> = {
  sintetico: "Césped sintético",
  natural: "Césped natural",
  cemento: "Cemento",
};

/**
 * Datos del complejo del cliente: Cover FC (Cover Fútbol 5), Almagro.
 * Fuente: ficha de Google Business + directorios deportivos.
 * Los precios son de referencia y se ajustan desde el panel de admin.
 */
export const venues: Venue[] = [
  {
    id: "v1",
    slug: "cover-fc",
    name: "Cover FC",
    city: "Buenos Aires",
    neighborhood: "Almagro",
    address: "Yatay 556, Almagro, CABA",
    description:
      "Club deportivo en el corazón de Almagro con canchas techadas: jugás llueva o truene, de día o de noche. Fútbol 5 en césped sintético y fútbol 8, con buffet y parrilla para el tercer tiempo, vestuarios con duchas y estacionamiento. También: escuelita de fútbol, torneos y cumpleaños.",
    rating: 4.2,
    reviewCount: 97,
    amenities: [
      "estacionamiento",
      "buffet",
      "vestuarios",
      "duchas",
      "parrilla",
      "iluminacion-led",
    ],
    openHour: 10,
    closeHour: 24,
    mapX: 50,
    mapY: 50,
    featured: true,
    fields: [
      {
        id: "cv-f1",
        name: "Cancha 1",
        type: "F5",
        surface: "sintetico",
        roof: "techada",
        pricePerHour: 24000,
        hue: 145,
      },
      {
        id: "cv-f2",
        name: "Cancha 2",
        type: "F5",
        surface: "sintetico",
        roof: "techada",
        pricePerHour: 24000,
        hue: 155,
      },
      {
        id: "cv-f3",
        name: "Cancha 3",
        type: "F8",
        surface: "cemento",
        roof: "techada",
        pricePerHour: 38000,
        hue: 132,
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Marcos R.",
        rating: 5,
        date: "2026-05-28",
        text: "Un clásico de Almagro. Canchas techadas, así que nunca se suspende. El buffet con parrilla para el tercer tiempo es lo más.",
      },
      {
        id: "r2",
        author: "Valentina L.",
        rating: 4,
        date: "2026-05-15",
        text: "Festejamos el cumple de mi hijo acá y salió perfecto. La escuelita de fútbol también es muy buena.",
      },
      {
        id: "r3",
        author: "Diego M.",
        rating: 4,
        date: "2026-05-02",
        text: "Buena ubicación, a metros de Corrientes. Vestuarios con duchas y estacionamiento, que en Almagro no es poco.",
      },
    ],
  },
];

export function getVenue(slug: string) {
  return venues.find((v) => v.slug === slug);
}
