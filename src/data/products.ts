import type { CategoryId } from "@/data/categories";

export interface Product {
  id: string;
  slug: string;
  brand: string;
  nameTh: string;
  nameEn: string;
  category: CategoryId;
  packCount: number;
  sizeMm: number | null;
  price: number | null;
  image: string;
  imageCutout: string;
  imageBack?: string;
  imageBackCutout?: string;
  modelUrl?: string | null;
  features: string[];
  usage: string | null;
  warnings: string[] | null;
  showDemoRating: boolean;
}

export interface ProductVisualTheme {
  ambientTint: string;
  spotlightTint: string;
  cssGlow: string;
  badgeRing: string;
  boxColor: string;
  edgeHighlight: string;
}

export const PRODUCT_THEMES: Record<string, ProductVisualTheme> = {
  "durex-kingtex": {
    // Deeper rose-wine ambient tint
    ambientTint: "#F3DCE6",
    spotlightTint: "#FFE3EE",
    cssGlow: "rgba(184, 41, 107, 0.16)",
    badgeRing: "#B8296B",
    boxColor: "#111215",
    edgeHighlight: "#D9A84E",
  },
  "durex-comfort": {
    // Soft blue-tinged pink ambient tint
    ambientTint: "#E8E6F5",
    spotlightTint: "#EDF0FF",
    cssGlow: "rgba(116, 130, 201, 0.18)",
    badgeRing: "#5B68A8",
    boxColor: "#0E286E",
    edgeHighlight: "#6888E8",
  },
};

export const PRODUCTS: readonly Product[] = [
  {
    id: "durex-kingtex",
    slug: "durex-kingtex",
    brand: "Durex",
    nameTh: "ถุงยางอนามัย ดูเร็กซ์ คิงเท็ค",
    nameEn: "Durex Kingtex",
    category: "condoms",
    packCount: 3,
    sizeMm: null,
    price: null,
    image: "/products/durex-kingtex.jpg",
    imageCutout: "/products/durex-kingtex-cutout.webp",
    imageBack: "/products/durex-kingtex-back.jpg",
    imageBackCutout: "/products/durex-kingtex-back-cutout.webp",
    modelUrl: null,
    features: ["ถุงยางอนามัย ดูเร็กซ์ คิงเท็ค", "บรรจุ 3 ชิ้น"],
    usage: null,
    warnings: null,
    showDemoRating: true,
  },
  {
    id: "durex-comfort",
    slug: "durex-comfort",
    brand: "Durex",
    nameTh: "ถุงยางอนามัย ดูเร็กซ์ คอมฟอร์ท",
    nameEn: "Durex Comfort",
    category: "condoms",
    packCount: 3,
    sizeMm: 56,
    price: null,
    image: "/products/durex-comfort.jpg",
    imageCutout: "/products/durex-comfort-cutout.webp",
    imageBack: "/products/durex-comfort-back.jpg",
    imageBackCutout: "/products/durex-comfort-back-cutout.webp",
    modelUrl: null,
    features: [
      "ถุงยางอนามัย ดูเร็กซ์ คอมฟอร์ท",
      "ขนาด 56 มม.",
      "บรรจุ 3 ชิ้น",
    ],
    usage: null,
    warnings: null,
    showDemoRating: true,
  },
] as const;

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((item) => item.id === id);
}
