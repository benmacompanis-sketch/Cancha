import { getVenue } from "./venues";

/**
 * Datos de la empresa: el sitio es la web oficial de Cover FC
 * (Cover Fútbol 5), club deportivo en Almagro, CABA.
 * Fuente: ficha de Google Business + directorios deportivos.
 */
export const COMPANY = {
  venue: getVenue("cover-fc")!,
  name: "Cover FC",
  tagline: "Club deportivo en Almagro",
  phone: "011 4862-3880",
  whatsapp: "+54 9 11 6854-3192",
  address: "Yatay 556, Almagro, CABA",
  hours: [
    { days: "Todos los días", time: "10:00 – 00:30" },
  ],
  stats: {
    fields: 3,
    rating: 4.2,
    reviews: 97,
  },
  extras: ["Escuelita de fútbol", "Torneos", "Cumpleaños", "Colegios"],
};
