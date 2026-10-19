import { Product } from "@/types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "teff-magna-01",
    farmerId: "f-101",
    farmerName: "Gemechu Desta",
    cooperative: "Oda Gida Agricultural Farmers Union",
    farmerPhone: "0911876543",
    categoryId: "cereals-grains",
    categoryName: "Cereals & Grains",
    name: "Export Grade Pure White Teff (Magna)",
    description: "Sustainably harvested highland Magna White Teff with immaculate uniform grain texture. Cleaned and processed in certified sorting sheds with certified 99.2% seed purity. Ideal for commercial injera bakeries, millers, and grain distributors.",
    unitPrice: 9400,
    unit: "Quintal (100kg)",
    quantityAvailable: 150,
    minOrderQuantity: 2,
    location: "Debre Birhan Mandi Terminal, North Shewa",
    assayGrade: "Grade 1 (99.2% Purity)",
    moistureContent: "11.2% (WDRA Standard: < 12.5%)",
    purity: "99.2% Certified Clean",
    harvestSeason: "Main Season Harvest (Meher 2026)",
    storageWarehouse: "Central Grain Warehouse #08, Silo Bay B",
    badge: "Spot e-Auction Lot",
    status: "ACTIVE",
    imageUrls: ["/commodities/teff.jpg"],
    averageRating: 4.9,
    totalReviews: 84,
    createdAt: "2026-10-15T08:30:00Z",
  },
  {
    id: "coffee-sidama-02",
    farmerId: "f-102",
    farmerName: "Wondwossen Bekele",
    cooperative: "Sidama Organic Coffee Producers Union",
    farmerPhone: "0912345678",
    categoryId: "coffee-spices",
    categoryName: "Coffee & Spices",
    name: "Sidama Washed Specialty Green Coffee Beans",
    description: "High altitude (2,100m) washed specialty green Arabica coffee beans. Features bright floral jasmine aroma, bergamot citrus notes, and refined cane sugar sweetness. Moisture content strictly maintained under 11.5% with ECX Q1 certification.",
    unitPrice: 28500,
    unit: "Bag (60kg Jute)",
    quantityAvailable: 60,
    minOrderQuantity: 1,
    location: "Hawassa Central Dry Port & Export Yard",
    assayGrade: "Q1 Specialty Grade (SCA 87.5)",
    moistureContent: "10.8% Moisture Meter Assayed",
    purity: "Zero primary defects, hand-sorted",
    harvestSeason: "Late Year Wet Mill Processing",
    storageWarehouse: "Bonded Climate-Controlled Logistics Hub",
    badge: "Export Certified",
    status: "ACTIVE",
    imageUrls: ["/commodities/coffee.jpg"],
    averageRating: 5.0,
    totalReviews: 112,
    createdAt: "2026-10-16T11:00:00Z",
  },
  {
    id: "wheat-durum-03",
    farmerId: "f-103",
    farmerName: "Tsegaye Alemu",
    cooperative: "Arsi Bale Flour & Grain Cooperative",
    farmerPhone: "0913456789",
    categoryId: "cereals-grains",
    categoryName: "Cereals & Grains",
    name: "Hard Amber Durum Wheat for Pasta Milling",
    description: "Premium high-protein Hard Amber Durum Wheat cultivated in the fertile plains of Bale. Rigorously tested for wet gluten index (> 28%) and high vitreous kernel count. Directly packaged in WDRA-certified hermetic bags.",
    unitPrice: 6200,
    unit: "Quintal (100kg)",
    quantityAvailable: 280,
    minOrderQuantity: 5,
    location: "Robe Grain Terminal Hub, Bale Zone",
    assayGrade: "Grade A (14.2% Protein)",
    moistureContent: "12.0% Moisture Assayed",
    purity: "98.5% Sound Kernel Guarantee",
    harvestSeason: "Bale Highland Meher Harvest",
    storageWarehouse: "Regional Grain Elevator Silo 4",
    badge: "High Volume Lot",
    status: "ACTIVE",
    imageUrls: ["/commodities/wheat.jpg"],
    averageRating: 4.8,
    totalReviews: 67,
    createdAt: "2026-10-14T09:15:00Z",
  },
  {
    id: "onion-adama-04",
    farmerId: "f-104",
    farmerName: "Chala Tolosa",
    cooperative: "Meki-Batu Vegetable Growers Union",
    farmerPhone: "0914567890",
    categoryId: "vegetables",
    categoryName: "Vegetables",
    name: "Fresh Red Bombay Cooking Onions",
    description: "Crisp, pungent Red Bombay onions harvested from irrigated river basin soils. Cured in ventilated sheds with tight dry outer skins to prevent post-harvest spoilage during cross-country logistics transit.",
    unitPrice: 85,
    unit: "KG (Mesh Net 50kg)",
    quantityAvailable: 5000,
    minOrderQuantity: 100,
    location: "Adama Wholesale Mandi Distribution Yard",
    assayGrade: "Export Quality Grade 1",
    moistureContent: "Air-cured ventilated batch",
    purity: "Graded 50-70mm uniform bulb size",
    harvestSeason: "Fresh Bi-Weekly Field Harvest",
    storageWarehouse: "Cold-chain pre-cooling shed bay #1",
    badge: "Fresh Produce Fast-Track",
    status: "ACTIVE",
    imageUrls: ["/commodities/onions.jpg"],
    averageRating: 4.7,
    totalReviews: 95,
    createdAt: "2026-10-18T07:45:00Z",
  },
  {
    id: "sesame-humera-05",
    farmerId: "f-105",
    farmerName: "Mulugeta Haile",
    cooperative: "Northwest Agricultural Farmers Syndicate",
    farmerPhone: "0915678901",
    categoryId: "pulses-oilseeds",
    categoryName: "Pulses & Oilseeds",
    name: "Whitish Humera Natural Sesame Seeds",
    description: "World-renowned Humera sesame seeds revered for their high oil content (54%+), sweet nutty aroma, and uniform creamy white color. Standardized for international confectionery and oilseed extraction.",
    unitPrice: 16800,
    unit: "Quintal (100kg)",
    quantityAvailable: 90,
    minOrderQuantity: 2,
    location: "Gondar Commodity Terminal Depot",
    assayGrade: "Grade 1 (54% Oil Content)",
    moistureContent: "6.2% Low Moisture Assayed",
    purity: "99.0% Machine Cleaned",
    harvestSeason: "Dry Savannah Winter Harvest",
    storageWarehouse: "Gondar Dry Storage Bay C",
    badge: "Spot e-Auction Lot",
    status: "ACTIVE",
    imageUrls: ["/commodities/sesame.jpg"],
    averageRating: 4.9,
    totalReviews: 43,
    createdAt: "2026-10-17T13:20:00Z",
  },
  {
    id: "maize-bako-06",
    farmerId: "f-106",
    farmerName: "Desta Regassa",
    cooperative: "Bako Hybrid Grain Growers Union",
    farmerPhone: "0916789012",
    categoryId: "cereals-grains",
    categoryName: "Cereals & Grains",
    name: "BH-661 Yellow Feed & Milling Maize",
    description: "Uniform large-grain yellow maize hybrid produced under supervised agronomic extension. Low aflatoxin certified (< 10 ppb), double-screened for chaff removal, and packaged in tamper-evident 100kg sacks.",
    unitPrice: 4800,
    unit: "Quintal (100kg)",
    quantityAvailable: 400,
    minOrderQuantity: 10,
    location: "Nekemte Central Logistics Depot",
    assayGrade: "Aflatoxin Certified (< 10 ppb)",
    moistureContent: "12.8% Controlled Moisture",
    purity: "98.8% Sound Grain Ratio",
    harvestSeason: "Western Highland Autumn Harvest",
    storageWarehouse: "Bako Grain Elevator Silo 2",
    badge: "High Volume Lot",
    status: "ACTIVE",
    imageUrls: ["/commodities/maize.jpg"],
    averageRating: 4.8,
    totalReviews: 52,
    createdAt: "2026-10-13T10:00:00Z",
  },
];

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  try {
    const custom = localStorage.getItem("agri_custom_products");
    if (custom) {
      const parsed = JSON.parse(custom);
      return [...parsed, ...INITIAL_PRODUCTS];
    }
  } catch (e) {
    console.error("Error reading stored products", e);
  }
  return INITIAL_PRODUCTS;
}

export function saveProduct(product: Product): void {
  if (typeof window === "undefined") return;
  try {
    const custom = localStorage.getItem("agri_custom_products");
    const existing: Product[] = custom ? JSON.parse(custom) : [];
    const updated = [product, ...existing.filter((p) => p.id !== product.id)];
    localStorage.setItem("agri_custom_products", JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving product", e);
  }
}

export function deleteStoredProduct(productId: string): void {
  if (typeof window === "undefined") return;
  try {
    const custom = localStorage.getItem("agri_custom_products");
    if (custom) {
      const existing: Product[] = JSON.parse(custom);
      const filtered = existing.filter((p) => p.id !== productId);
      localStorage.setItem("agri_custom_products", JSON.stringify(filtered));
    }
  } catch (e) {
    console.error("Error deleting product", e);
  }
}
