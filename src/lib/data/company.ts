import { getVenue } from "./venues";

/**
 * Datos de la empresa: el sitio es la web oficial de un único
 * complejo deportivo. Toda la información del negocio vive acá.
 */
export const COMPANY = {
  venue: getVenue("la-bombonerita")!,
  name: "La Bombonerita",
  tagline: "Complejo de fútbol en Caballito",
  phone: "+54 11 4901-2233",
  whatsapp: "+54 9 11 5555-1122",
  email: "reservas@labombonerita.com.ar",
  instagram: "@labombonerita.futbol",
  address: "Av. Rivadavia 5340, Caballito, CABA",
  hours: [
    { days: "Lunes a viernes", time: "09:00 – 24:00" },
    { days: "Sábados", time: "09:00 – 24:00" },
    { days: "Domingos y feriados", time: "10:00 – 23:00" },
  ],
  stats: {
    fields: 4,
    rating: 4.9,
    reviews: 482,
    yearsOpen: 12,
  },
};
