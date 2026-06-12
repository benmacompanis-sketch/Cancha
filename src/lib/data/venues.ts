import type { Venue } from "./types";

export const AMENITY_LABELS: Record<string, string> = {
  estacionamiento: "Estacionamiento",
  buffet: "Buffet",
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

export const venues: Venue[] = [
  {
    id: "v1",
    slug: "la-bombonerita",
    name: "La Bombonerita",
    city: "Buenos Aires",
    neighborhood: "Caballito",
    address: "Av. Rivadavia 5340, Caballito",
    description:
      "Complejo insignia de Caballito con 6 canchas de última generación, césped sintético FIFA Quality y sistema de iluminación LED profesional. Buffet completo, vestuarios climatizados y estacionamiento propio. Ideal para partidos nocturnos y torneos corporativos.",
    rating: 4.9,
    reviewCount: 482,
    amenities: ["estacionamiento", "buffet", "vestuarios", "duchas", "iluminacion-led", "wifi", "parrilla"],
    openHour: 9,
    closeHour: 24,
    mapX: 48,
    mapY: 46,
    featured: true,
    fields: [
      { id: "v1-f1", name: "Cancha 1 · Maracaná", type: "F5", surface: "sintetico", roof: "techada", pricePerHour: 28000, hue: 145 },
      { id: "v1-f2", name: "Cancha 2 · Monumental", type: "F5", surface: "sintetico", roof: "techada", pricePerHour: 28000, hue: 155 },
      { id: "v1-f3", name: "Cancha 3 · Azteca", type: "F7", surface: "sintetico", roof: "descubierta", pricePerHour: 42000, hue: 130 },
      { id: "v1-f4", name: "Cancha 4 · Wembley", type: "F8", surface: "sintetico", roof: "descubierta", pricePerHour: 48000, hue: 160 },
    ],
    reviews: [
      { id: "r1", author: "Martín G.", rating: 5, date: "2026-05-28", text: "Las mejores canchas de Caballito, lejos. El sintético es nuevo y la iluminación impecable. Reservamos todos los jueves." },
      { id: "r2", author: "Lucas P.", rating: 5, date: "2026-05-20", text: "Buffet con buena birra y la reserva online es instantánea. Cero vueltas." },
      { id: "r3", author: "Federico A.", rating: 4, date: "2026-05-11", text: "Muy buen complejo. Los vestuarios podrían ser más grandes pero todo lo demás es 10 puntos." },
    ],
  },
  {
    id: "v2",
    slug: "club-norte-futbol",
    name: "Club Norte Fútbol",
    city: "Buenos Aires",
    neighborhood: "Belgrano",
    address: "Cabildo 2870, Belgrano",
    description:
      "El clásico de zona norte renovado por completo en 2025. Tres canchas techadas con clima controlado, café de especialidad y zona lounge para el tercer tiempo. A dos cuadras del subte D.",
    rating: 4.8,
    reviewCount: 356,
    amenities: ["buffet", "vestuarios", "duchas", "wifi", "iluminacion-led", "kiosco"],
    openHour: 8,
    closeHour: 23,
    mapX: 38,
    mapY: 22,
    featured: true,
    fields: [
      { id: "v2-f1", name: "Cancha A", type: "F5", surface: "sintetico", roof: "techada", pricePerHour: 30000, hue: 150 },
      { id: "v2-f2", name: "Cancha B", type: "F5", surface: "sintetico", roof: "techada", pricePerHour: 30000, hue: 140 },
      { id: "v2-f3", name: "Cancha C", type: "F6", surface: "sintetico", roof: "techada", pricePerHour: 36000, hue: 165 },
    ],
    reviews: [
      { id: "r4", author: "Sofía R.", rating: 5, date: "2026-06-01", text: "Jugamos el torneo femenino acá. Organización impecable y las canchas en estado perfecto." },
      { id: "r5", author: "Nico T.", rating: 5, date: "2026-05-15", text: "Techada con clima: en invierno no hay nada igual. El café del buffet es un plus enorme." },
    ],
  },
  {
    id: "v3",
    slug: "predio-el-once",
    name: "Predio El Once",
    city: "Buenos Aires",
    neighborhood: "Palermo",
    address: "Av. Int. Bullrich 480, Palermo",
    description:
      "El único predio de Palermo con cancha de 11 de césped natural profesional. Además, cinco canchas de F5 y F7 sintéticas, parrillas para el tercer tiempo y estacionamiento para 80 autos.",
    rating: 4.7,
    reviewCount: 611,
    amenities: ["estacionamiento", "buffet", "vestuarios", "duchas", "parrilla", "iluminacion-led"],
    openHour: 9,
    closeHour: 23,
    mapX: 55,
    mapY: 30,
    featured: true,
    fields: [
      { id: "v3-f1", name: "Cancha Principal", type: "F11", surface: "natural", roof: "descubierta", pricePerHour: 95000, hue: 120 },
      { id: "v3-f2", name: "Cancha 2", type: "F7", surface: "sintetico", roof: "descubierta", pricePerHour: 44000, hue: 135 },
      { id: "v3-f3", name: "Cancha 3", type: "F5", surface: "sintetico", roof: "techada", pricePerHour: 29000, hue: 150 },
      { id: "v3-f4", name: "Cancha 4", type: "F5", surface: "sintetico", roof: "techada", pricePerHour: 29000, hue: 158 },
    ],
    reviews: [
      { id: "r6", author: "Hernán D.", rating: 5, date: "2026-05-30", text: "Jugar en la cancha de 11 con césped natural es otra cosa. La cuidan muchísimo." },
      { id: "r7", author: "Agustín M.", rating: 4, date: "2026-05-22", text: "Excelente predio. Los findes se llena, conviene reservar con tiempo desde la app." },
    ],
  },
  {
    id: "v4",
    slug: "futbol-city-villa-crespo",
    name: "Fútbol City",
    city: "Buenos Aires",
    neighborhood: "Villa Crespo",
    address: "Scalabrini Ortiz 757, Villa Crespo",
    description:
      "Cuatro canchas techadas en pleno Villa Crespo con la mejor relación precio-calidad de la zona. Kiosco 24/7, vestuarios renovados y descuentos para reservas recurrentes.",
    rating: 4.6,
    reviewCount: 289,
    amenities: ["vestuarios", "kiosco", "iluminacion-led", "wifi"],
    openHour: 10,
    closeHour: 24,
    mapX: 44,
    mapY: 38,
    fields: [
      { id: "v4-f1", name: "Cancha 1", type: "F5", surface: "sintetico", roof: "techada", pricePerHour: 24000, hue: 140 },
      { id: "v4-f2", name: "Cancha 2", type: "F5", surface: "sintetico", roof: "techada", pricePerHour: 24000, hue: 148 },
      { id: "v4-f3", name: "Cancha 3", type: "F6", surface: "sintetico", roof: "techada", pricePerHour: 30000, hue: 156 },
      { id: "v4-f4", name: "Cancha 4", type: "F7", surface: "sintetico", roof: "techada", pricePerHour: 38000, hue: 128 },
    ],
    reviews: [
      { id: "r8", author: "Ramiro S.", rating: 5, date: "2026-06-03", text: "Precio imbatible para la calidad. Reservo con la app en 20 segundos, literal." },
    ],
  },
  {
    id: "v5",
    slug: "la-redonda-san-telmo",
    name: "La Redonda",
    city: "Buenos Aires",
    neighborhood: "San Telmo",
    address: "Av. San Juan 1150, San Telmo",
    description:
      "Complejo boutique en San Telmo con dos canchas de F5 premium, música en cancha, bar de especialidad y ambiente único. El spot favorito de los partidos after office.",
    rating: 4.8,
    reviewCount: 198,
    amenities: ["buffet", "vestuarios", "wifi", "iluminacion-led"],
    openHour: 12,
    closeHour: 24,
    mapX: 58,
    mapY: 55,
    fields: [
      { id: "v5-f1", name: "Cancha Norte", type: "F5", surface: "sintetico", roof: "techada", pricePerHour: 27000, hue: 152 },
      { id: "v5-f2", name: "Cancha Sur", type: "F5", surface: "sintetico", roof: "techada", pricePerHour: 27000, hue: 144 },
    ],
    reviews: [
      { id: "r9", author: "Julián C.", rating: 5, date: "2026-05-25", text: "El after office perfecto: partido + birra en el bar. La música en cancha es un golazo." },
    ],
  },
  {
    id: "v6",
    slug: "complejo-rio-vicente-lopez",
    name: "Complejo Río",
    city: "Vicente López",
    neighborhood: "Olivos",
    address: "Paraná 3520, Olivos",
    description:
      "Frente al río, con vista abierta y brisa natural. Cinco canchas descubiertas de césped sintético de 50 mm, parrillas, buffet con terraza y estacionamiento gratuito para clientes.",
    rating: 4.7,
    reviewCount: 334,
    amenities: ["estacionamiento", "buffet", "vestuarios", "duchas", "parrilla"],
    openHour: 9,
    closeHour: 23,
    mapX: 30,
    mapY: 12,
    fields: [
      { id: "v6-f1", name: "Cancha 1 · Río", type: "F5", surface: "sintetico", roof: "descubierta", pricePerHour: 25000, hue: 138 },
      { id: "v6-f2", name: "Cancha 2 · Costa", type: "F7", surface: "sintetico", roof: "descubierta", pricePerHour: 40000, hue: 146 },
      { id: "v6-f3", name: "Cancha 3 · Delta", type: "F8", surface: "sintetico", roof: "descubierta", pricePerHour: 46000, hue: 154 },
    ],
    reviews: [
      { id: "r10", author: "Tomás B.", rating: 5, date: "2026-05-18", text: "Jugar con vista al río un sábado a la tarde no tiene precio. Después, parrilla. Plan perfecto." },
    ],
  },
];

export function getVenue(slug: string) {
  return venues.find((v) => v.slug === slug);
}

export const NEIGHBORHOODS = [...new Set(venues.map((v) => v.neighborhood))];
export const CITIES = [...new Set(venues.map((v) => v.city))];
