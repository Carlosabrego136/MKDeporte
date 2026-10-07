/* ============================================================
 *  MKDeporte — todo el contenido editable vive en este archivo
 * ============================================================ */

export const BRAND = {
  name: "MKDEPORTE",
  left: ["MK", "DEPORTE"],
  right: ["ROPA", "DEPORTIVA"],
} as const;

export const TEXT = {
  slogan: [
    "MUÉVETE CON FUERZA,",
    "ENTRENA CON ESTILO",
    "Y SIÉNTETE",
    "IMPARABLE",
  ],
  start: ["VER", "COLECCIÓN"],
  back: "VOLVER AL INICIO",
  catalog: "VER CATÁLOGO",
  skip: "SALTAR ›",
  collection: ["COLECCIÓN", "#451"],
} as const;

/** Si pones aquí tu número (formato 521XXXXXXXXXX) aparece el botón "PEDIR" en el catálogo. */
export const WHATSAPP_NUMBER = "525568888544";

/* ---------------- Videos / fondo (los del diseño original) ---------------- */
export const POSTER_URL =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_053103_a6c6fd5c-8f43-4942-a487-e81c8f3cd0c1.png&w=1920&q=85";

export const HERO_VIDEO_URL =
  "https://stream.mux.com/YyFgoUXUTVMiVMMLeQoq49tP00joMyEzoRmnEnk02H5rA.m3u8";

/* ---------------- Fotos reales (Pexels, licencia libre) ---------------- */
const pexels = (id: number, w: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const pexelsSrc = pexels;

export const pexelsSrcSet = (id: number, widths: readonly number[]) =>
  widths.map((w) => `${pexels(id, w)} ${w}w`).join(", ");

/* ---------------- Catálogo ---------------- */
export type Category = "leggins" | "shorts" | "tops" | "conjuntos";
export type CategoryFilter = "todo" | Category;

export interface CatalogItem {
  id: string;
  name: string;
  price: string;
  category: Category;
  /** ID de la foto en Pexels */
  photo: number;
  alt: string;
}

export const CATEGORIES: readonly { id: CategoryFilter; label: string }[] = [
  { id: "todo", label: "TODO" },
  { id: "leggins", label: "LEGGINS" },
  { id: "shorts", label: "SHORTS" },
  { id: "tops", label: "TOPS" },
  { id: "conjuntos", label: "CONJUNTOS" },
];

export const CATALOG: readonly CatalogItem[] = [
  {
    id: "leggins-sculpt",
    name: "LEGGINS SCULPT",
    price: "$599 MXN",
    category: "leggins",
    photo: 3844000,
    alt: "Mujer con top deportivo y leggins grises haciendo ejercicio al aire libre",
  },
  {
    id: "leggins-pro",
    name: "LEGGINS PRO NEGRO",
    price: "$549 MXN",
    category: "leggins",
    photo: 6740754,
    alt: "Mujer con leggins negros extendiendo un tapete de yoga",
  },
  {
    id: "leggins-aqua",
    name: "LEGGINS AQUA",
    price: "$579 MXN",
    category: "leggins",
    photo: 11117152,
    alt: "Mujer con leggins y top deportivo en tono azul",
  },
  {
    id: "shorts-flex",
    name: "SHORTS FLEX",
    price: "$399 MXN",
    category: "shorts",
    photo: 8018919,
    alt: "Mujer con top blanco y shorts negros haciendo yoga junto al mar",
  },
  {
    id: "shorts-run",
    name: "SHORTS RUN",
    price: "$379 MXN",
    category: "shorts",
    photo: 3763996,
    alt: "Mujer con top rojo y shorts negros en una pista de atletismo",
  },
  {
    id: "top-air",
    name: "TOP AIR",
    price: "$349 MXN",
    category: "tops",
    photo: 3764154,
    alt: "Mujer corriendo con top deportivo negro",
  },
  {
    id: "top-cloud",
    name: "TOP CLOUD",
    price: "$329 MXN",
    category: "tops",
    photo: 3855612,
    alt: "Mujer con top deportivo gris estirando en el gimnasio",
  },
  {
    id: "conjunto-urban",
    name: "CONJUNTO URBAN",
    price: "$849 MXN",
    category: "conjuntos",
    photo: 206341,
    alt: "Mujer con top y leggins deportivos frente a un muro de grafiti",
  },
  {
    id: "conjunto-nude",
    name: "CONJUNTO NUDE",
    price: "$829 MXN",
    category: "conjuntos",
    photo: 8436750,
    alt: "Mujer con conjunto deportivo beige sentada en un tapete de yoga",
  },
  {
    id: "conjunto-aqua",
    name: "CONJUNTO AQUA",
    price: "$799 MXN",
    category: "conjuntos",
    photo: 3822227,
    alt: "Mujer con top azul y leggins blancos estirando sobre un tapete",
  },
  {
    id: "conjunto-gym",
    name: "CONJUNTO GYM",
    price: "$829 MXN",
    category: "conjuntos",
    photo: 6049164,
    alt: "Mujer con top deportivo y leggins negros en el gimnasio",
  },
];

/* ---------------- Mazo de 3 tarjetas de la pantalla 2 ---------------- */
export interface HoverOffset {
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

export interface DeckCardConfig {
  itemId: string;
  video: string;
  position: "left" | "center" | "right";
  initialRotation: number;
  hoverOffset: HoverOffset;
  zIndexClass: string;
}

export const DECK: readonly DeckCardConfig[] = [
  {
    itemId: "leggins-sculpt",
    video:
      "https://stream.mux.com/S9BmS8DLYYowz7jr1BkN2PbAQm4bjEwijllpwmEB4xA.m3u8",
    position: "left",
    initialRotation: -8,
    hoverOffset: { x: -60, y: -25, rotate: -12, scale: 1.04 },
    zIndexClass: "z-20 hover:z-40",
  },
  {
    itemId: "shorts-flex",
    video:
      "https://stream.mux.com/83kMTSKA4Xy01RTddNwDdt7OjCocQTCdKHY7AsD02Dlgc.m3u8",
    position: "center",
    initialRotation: 0,
    hoverOffset: { x: 0, y: -15, rotate: 0, scale: 1.08 },
    zIndexClass: "z-30 hover:z-40",
  },
  {
    itemId: "conjunto-aqua",
    video:
      "https://stream.mux.com/c4KUkE6NHGljcc4M8458iMEdHAbUvsG5MTpqefzBYvo.m3u8",
    position: "right",
    initialRotation: 8,
    hoverOffset: { x: 60, y: -25, rotate: 12, scale: 1.04 },
    zIndexClass: "z-20 hover:z-40",
  },
];

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_BOUNCE = [0.34, 1.56, 0.64, 1] as const;
