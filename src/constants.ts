export const BRAND = {
  line1: "AURA",
  line2: "ACTIVE",
  right1: "ROPA",
  right2: "DEPORTIVA",
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
  collection: "COLECCIÓN #451",
} as const;

export const POSTER_URL =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_053103_a6c6fd5c-8f43-4942-a487-e81c8f3cd0c1.png&w=1920&q=85";

export const HERO_VIDEO_URL =
  "https://stream.mux.com/YyFgoUXUTVMiVMMLeQoq49tP00joMyEzoRmnEnk02H5rA.m3u8";

export interface HoverOffset {
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

export interface ProductConfig {
  id: string;
  src: string;
  name: string;
  price: string;
  initialRotation: number;
  hoverOffset: HoverOffset;
  zIndexClass: string;
  className: string;
}

export const PRODUCTS: readonly ProductConfig[] = [
  {
    id: "leggins",
    src: "https://stream.mux.com/S9BmS8DLYYowz7jr1BkN2PbAQm4bjEwijllpwmEB4xA.m3u8",
    name: "LEGGINS SCULPT",
    price: "$599 MXN",
    initialRotation: -8,
    hoverOffset: { x: -60, y: -25, rotate: -12, scale: 1.04 },
    zIndexClass: "z-20 hover:z-40",
    className: "-mr-14 sm:-mr-22 md:-mr-28 lg:-mr-32",
  },
  {
    id: "shorts",
    src: "https://stream.mux.com/83kMTSKA4Xy01RTddNwDdt7OjCocQTCdKHY7AsD02Dlgc.m3u8",
    name: "SHORTS FLEX",
    price: "$399 MXN",
    initialRotation: 0,
    hoverOffset: { x: 0, y: -15, rotate: 0, scale: 1.08 },
    zIndexClass: "z-30 hover:z-40",
    className: "scale-105",
  },
  {
    id: "top",
    src: "https://stream.mux.com/c4KUkE6NHGljcc4M8458iMEdHAbUvsG5MTpqefzBYvo.m3u8",
    name: "TOP AIR",
    price: "$349 MXN",
    initialRotation: 8,
    hoverOffset: { x: 60, y: -25, rotate: 12, scale: 1.04 },
    zIndexClass: "z-20 hover:z-40",
    className: "-ml-14 sm:-ml-22 md:-ml-28 lg:-ml-32",
  },
];

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_BOUNCE = [0.34, 1.56, 0.64, 1] as const;
