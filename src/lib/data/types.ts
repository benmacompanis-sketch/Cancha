export type FieldType = "F5" | "F6" | "F7" | "F8" | "F11";
export type Surface = "sintetico" | "natural" | "cemento";
export type Roof = "techada" | "descubierta";

export type Amenity =
  | "estacionamiento"
  | "buffet"
  | "vestuarios"
  | "parrilla"
  | "wifi"
  | "duchas"
  | "iluminacion-led"
  | "kiosco";

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  surface: Surface;
  roof: Roof;
  pricePerHour: number;
  /** gradiente decorativo para la visual de la cancha */
  hue: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export interface Venue {
  id: string;
  slug: string;
  name: string;
  city: string;
  neighborhood: string;
  address: string;
  description: string;
  rating: number;
  reviewCount: number;
  amenities: Amenity[];
  fields: Field[];
  reviews: Review[];
  openHour: number;
  closeHour: number;
  /** posición relativa en el mapa interactivo (0–100) */
  mapX: number;
  mapY: number;
  featured?: boolean;
}

export interface Slot {
  fieldId: string;
  date: string; // YYYY-MM-DD
  hour: number; // 0–23
  available: boolean;
  price: number;
}

export type BookingStatus = "confirmada" | "pendiente" | "cancelada" | "jugada";
export type PaymentMethod = "mercadopago" | "tarjeta" | "transferencia";
export type PaymentKind = "total" | "seña";

export interface Booking {
  id: string;
  code: string;
  venueSlug: string;
  venueName: string;
  fieldId: string;
  fieldName: string;
  fieldType: FieldType;
  date: string;
  hour: number;
  price: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paymentKind: PaymentKind;
  status: BookingStatus;
  createdAt: string;
  customerName: string;
  customerEmail: string;
}
