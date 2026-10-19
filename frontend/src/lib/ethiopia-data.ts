export interface MandiRate {
  id: string;
  commodity: string;
  category: "Cereals & Grains" | "Coffee & Spices" | "Pulses & Oilseeds" | "Vegetables & Horticulture";
  marketHub: string;
  region: "Oromia" | "Amhara" | "Sidama" | "Central Ethiopia / SNNP" | "Tigray" | "Somali" | "Addis Ababa";
  modalPrice: number; // in ETB
  unit: "Quintal (100kg)" | "KG";
  yesterdayPrice: number;
  minPrice: number;
  maxPrice: number;
  trend: "up" | "down" | "flat";
  changePercentage: number;
  dailyArrivals: string; // e.g. "850 Quintals"
  lastUpdated: string;
}

export interface AuctionTender {
  id: string;
  title: string;
  organization: string;
  organizationType: "Government Enterprise" | "Commercial Miller / Processor" | "Cooperative Union" | "Export Syndicate";
  commodity: string;
  quantityTotal: number;
  unit: "Quintal (100kg)" | "Bag (60kg)" | "Metric Ton";
  basePrice: number; // in ETB
  currentHighestBid: number; // in ETB
  totalBidsPlaced: number;
  location: string;
  deliveryHub: string;
  assayRequirements: string;
  deadlineHoursRemaining: number;
  status: "LIVE" | "CLOSING_SOON" | "AWARDED";
  verifiedECX: boolean;
}

export interface CertifiedWarehouse {
  id: string;
  name: string;
  code: string;
  region: string;
  location: string;
  totalCapacityMT: number;
  availableCapacityMT: number;
  facilities: string[];
  storageRatePerQtlMonth: number; // in ETB
  contactPhone: string;
  managerName: string;
  wdraCertified: boolean;
}

export interface QualityAssayReport {
  certificateNumber: string;
  commodity: string;
  growerOrUnion: string;
  originWoreda: string;
  region: string;
  lotSize: string;
  assayDate: string;
  officialGrade: "ECX Grade 1" | "ECX Grade 2" | "ECX Grade 3" | "Export Q1 Specialty";
  moistureContent: number; // percentage
  purityScore: number; // percentage
  foreignMatter: number; // percentage
  defectRate: number; // percentage
  oilOrProteinContent?: string;
  cupScore?: number;
  status: "VERIFIED" | "PENDING_LAB";
  inspector: string;
}

// ─────────────────────────────────────────────────────────────
// REALISTIC ETHIOPIAN MANDI RATES (ECX & REGIONAL TERMINALS)
// ─────────────────────────────────────────────────────────────
export const ETHIOPIA_MANDI_RATES: MandiRate[] = [
  {
    id: "mandi-01",
    commodity: "Pure White Teff (Magna)",
    category: "Cereals & Grains",
    marketHub: "Kality Central Grains Terminal",
    region: "Addis Ababa",
    modalPrice: 9450,
    unit: "Quintal (100kg)",
    yesterdayPrice: 9200,
    minPrice: 9100,
    maxPrice: 9600,
    trend: "up",
    changePercentage: 2.7,
    dailyArrivals: "1,240 Quintals",
    lastUpdated: "Today, 11:30 AM",
  },
  {
    id: "mandi-02",
    commodity: "Sergegna Mixed Teff",
    category: "Cereals & Grains",
    marketHub: "Adama Commodity Mandi Yard",
    region: "Oromia",
    modalPrice: 7900,
    unit: "Quintal (100kg)",
    yesterdayPrice: 8050,
    minPrice: 7700,
    maxPrice: 8100,
    trend: "down",
    changePercentage: -1.8,
    dailyArrivals: "890 Quintals",
    lastUpdated: "Today, 10:45 AM",
  },
  {
    id: "mandi-03",
    commodity: "Washed Sidama Specialty Coffee",
    category: "Coffee & Spices",
    marketHub: "Hawassa Central Dry Port Yard",
    region: "Sidama",
    modalPrice: 480,
    unit: "KG",
    yesterdayPrice: 465,
    minPrice: 450,
    maxPrice: 510,
    trend: "up",
    changePercentage: 3.2,
    dailyArrivals: "450 Bags (60kg)",
    lastUpdated: "Today, 09:15 AM",
  },
  {
    id: "mandi-04",
    commodity: "Jimma Limu Natural Arabica",
    category: "Coffee & Spices",
    marketHub: "Jimma Specialty Mandi Terminal",
    region: "Oromia",
    modalPrice: 410,
    unit: "KG",
    yesterdayPrice: 410,
    minPrice: 395,
    maxPrice: 425,
    trend: "flat",
    changePercentage: 0.0,
    dailyArrivals: "620 Bags",
    lastUpdated: "Today, 12:00 PM",
  },
  {
    id: "mandi-05",
    commodity: "Hard Amber Durum Wheat",
    category: "Cereals & Grains",
    marketHub: "Robe Grain Terminal Hub, Bale",
    region: "Oromia",
    modalPrice: 6200,
    unit: "Quintal (100kg)",
    yesterdayPrice: 6050,
    minPrice: 5900,
    maxPrice: 6400,
    trend: "up",
    changePercentage: 2.5,
    dailyArrivals: "2,150 Quintals",
    lastUpdated: "Today, 08:30 AM",
  },
  {
    id: "mandi-06",
    commodity: "Humera Whitish Export Sesame",
    category: "Pulses & Oilseeds",
    marketHub: "Gondar Commodity Depot",
    region: "Amhara",
    modalPrice: 16800,
    unit: "Quintal (100kg)",
    yesterdayPrice: 16200,
    minPrice: 15900,
    maxPrice: 17200,
    trend: "up",
    changePercentage: 3.7,
    dailyArrivals: "780 Quintals",
    lastUpdated: "Today, 11:00 AM",
  },
  {
    id: "mandi-07",
    commodity: "BH-661 Yellow Milling Maize",
    category: "Cereals & Grains",
    marketHub: "Nekemte Central Depot",
    region: "Oromia",
    modalPrice: 4800,
    unit: "Quintal (100kg)",
    yesterdayPrice: 4950,
    minPrice: 4600,
    maxPrice: 5100,
    trend: "down",
    changePercentage: -3.0,
    dailyArrivals: "3,400 Quintals",
    lastUpdated: "Today, 10:00 AM",
  },
  {
    id: "mandi-08",
    commodity: "Red Haricot Canning Beans",
    category: "Pulses & Oilseeds",
    marketHub: "Wolaita Sodo Agriculture Yard",
    region: "Central Ethiopia / SNNP",
    modalPrice: 4150,
    unit: "Quintal (100kg)",
    yesterdayPrice: 4050,
    minPrice: 3950,
    maxPrice: 4300,
    trend: "up",
    changePercentage: 2.4,
    dailyArrivals: "650 Quintals",
    lastUpdated: "Today, 01:15 PM",
  },
  {
    id: "mandi-09",
    commodity: "Shashemene Red Table Potatoes",
    category: "Vegetables & Horticulture",
    marketHub: "Shashemene Agri Distribution Yard",
    region: "Oromia",
    modalPrice: 45,
    unit: "KG",
    yesterdayPrice: 48,
    minPrice: 40,
    maxPrice: 52,
    trend: "down",
    changePercentage: -6.2,
    dailyArrivals: "1,800 Sacks",
    lastUpdated: "Today, 07:45 AM",
  },
  {
    id: "mandi-10",
    commodity: "Red Bombay Cured Onions",
    category: "Vegetables & Horticulture",
    marketHub: "Meki River Basin Market",
    region: "Oromia",
    modalPrice: 85,
    unit: "KG",
    yesterdayPrice: 82,
    minPrice: 78,
    maxPrice: 92,
    trend: "up",
    changePercentage: 3.6,
    dailyArrivals: "2,200 Net Sacks",
    lastUpdated: "Today, 09:30 AM",
  },
  {
    id: "mandi-11",
    commodity: "Highland Kabuli Chickpeas",
    category: "Pulses & Oilseeds",
    marketHub: "Debre Zeit / Bishoftu Depot",
    region: "Oromia",
    modalPrice: 8300,
    unit: "Quintal (100kg)",
    yesterdayPrice: 8100,
    minPrice: 7900,
    maxPrice: 8500,
    trend: "up",
    changePercentage: 2.5,
    dailyArrivals: "540 Quintals",
    lastUpdated: "Today, 11:45 AM",
  },
  {
    id: "mandi-12",
    commodity: "Asela Certified Malting Barley",
    category: "Cereals & Grains",
    marketHub: "Asela Malt Factory Terminal",
    region: "Oromia",
    modalPrice: 5400,
    unit: "Quintal (100kg)",
    yesterdayPrice: 5350,
    minPrice: 5200,
    maxPrice: 5600,
    trend: "up",
    changePercentage: 0.9,
    dailyArrivals: "1,600 Quintals",
    lastUpdated: "Today, 10:15 AM",
  },
];

// ─────────────────────────────────────────────────────────────
// ACTIVE E-AUCTIONS & INSTITUTIONAL BULK TENDERS
// ─────────────────────────────────────────────────────────────
export const INITIAL_AUCTIONS: AuctionTender[] = [
  {
    id: "auc-01",
    title: "10,000 Quintals Durum Wheat Strategic Procurement",
    organization: "Ethiopian Grain Trade Enterprise (EGTE)",
    organizationType: "Government Enterprise",
    commodity: "Grade 1 Amber Durum Wheat",
    quantityTotal: 10000,
    unit: "Quintal (100kg)",
    basePrice: 5800,
    currentHighestBid: 6150,
    totalBidsPlaced: 18,
    location: "Adama Central Silo Reserve Bay 1",
    deliveryHub: "Adama Strategic Granary Depot",
    assayRequirements: "Protein > 13.5%, Moisture < 12.0%, Impurities < 0.8%",
    deadlineHoursRemaining: 4,
    status: "CLOSING_SOON",
    verifiedECX: true,
  },
  {
    id: "auc-02",
    title: "4,000 Quintals Magna White Teff Bulk Tender",
    organization: "Kaliti Food Share Company",
    organizationType: "Commercial Miller / Processor",
    commodity: "Pure White Teff (Ada Origin)",
    quantityTotal: 4000,
    unit: "Quintal (100kg)",
    basePrice: 9100,
    currentHighestBid: 9420,
    totalBidsPlaced: 24,
    location: "Bishoftu / Ada Cooperative Hub",
    deliveryHub: "Kaliti Flour & Biscuit Processing Plant",
    assayRequirements: "Moisture < 11.5%, Purity > 99.0%, Color: Pure Magna",
    deadlineHoursRemaining: 18,
    status: "LIVE",
    verifiedECX: true,
  },
  {
    id: "auc-03",
    title: "800 Bags Washed Specialty Yirgacheffe Q1",
    organization: "Oromia Coffee Farmers Cooperative Union (OCFCU)",
    organizationType: "Cooperative Union",
    commodity: "Export Arabica Green Coffee",
    quantityTotal: 800,
    unit: "Bag (60kg)",
    basePrice: 27000,
    currentHighestBid: 29400,
    totalBidsPlaced: 14,
    location: "Dilla Wet Mill & Coffee Yard",
    deliveryHub: "Addis Ababa Bonded Export Terminal (Kality)",
    assayRequirements: "SCA Q-Grade > 87.0, Screen 15+, Moisture 10.5%",
    deadlineHoursRemaining: 26,
    status: "LIVE",
    verifiedECX: true,
  },
  {
    id: "auc-04",
    title: "2,500 Quintals Asela Grade A Malting Barley",
    organization: "BGI Ethiopia Breweries Supply Division",
    organizationType: "Commercial Miller / Processor",
    commodity: "Two-Row Malting Barley",
    quantityTotal: 2500,
    unit: "Quintal (100kg)",
    basePrice: 5100,
    currentHighestBid: 5380,
    totalBidsPlaced: 11,
    location: "Asela Malt Factory Depot",
    deliveryHub: "St. George Brewery Maltings (Addis Ababa)",
    assayRequirements: "Germination Energy > 95%, Moisture < 12.5%, Protein 10.5-11.5%",
    deadlineHoursRemaining: 32,
    status: "LIVE",
    verifiedECX: true,
  },
  {
    id: "auc-05",
    title: "1,500 Quintals Canning Red Haricot Beans",
    organization: "Damota Pulses & Oilseeds Cooperative Union",
    organizationType: "Cooperative Union",
    commodity: "Red Haricot Beans",
    quantityTotal: 1500,
    unit: "Quintal (100kg)",
    basePrice: 3950,
    currentHighestBid: 4180,
    totalBidsPlaced: 9,
    location: "Wolaita Sodo Central Sorting Shed",
    deliveryHub: "Modjo Dry Port Export Corridor",
    assayRequirements: "Machine Cleaned, Foreign Matter < 1.0%, Sound Seed > 98%",
    deadlineHoursRemaining: 12,
    status: "LIVE",
    verifiedECX: true,
  },
];

// ─────────────────────────────────────────────────────────────
// CERTIFIED ETHIOPIAN PUBLIC WAREHOUSES (e-NWR)
// ─────────────────────────────────────────────────────────────
export const ETHIOPIA_WAREHOUSES: CertifiedWarehouse[] = [
  {
    id: "wh-01",
    name: "Adama Central Aerated Grain Silo Hub",
    code: "ETH-WH-ADA-01",
    region: "Oromia",
    location: "Adama Industrial Zone, Expressway Junction",
    totalCapacityMT: 50000,
    availableCapacityMT: 18500,
    facilities: [
      "Aerated Steel Silos (5 x 10,000 MT)",
      "High-speed grain intake (150 MT/hr)",
      "Continuous automated moisture telemetry",
      "Gas-tight phosphine fumigation chambers",
      "Weighbridge certified to 80 Metric Tons",
    ],
    storageRatePerQtlMonth: 16,
    contactPhone: "+251 22 111 4589",
    managerName: "Ato Bekele Tufa",
    wdraCertified: true,
  },
  {
    id: "wh-02",
    name: "Jimma Climate-Controlled Coffee & Spice Depot",
    code: "ETH-WH-JIM-02",
    region: "Oromia",
    location: "Jimma Agaro Road, Warehouse Corridor",
    totalCapacityMT: 30000,
    availableCapacityMT: 11200,
    facilities: [
      "Humidity regulated coffee sheds (< 60% RH)",
      "ECX on-site cupping & Q-grading laboratory",
      "Jute bag palletized storage with rodent barriers",
      "Armed 24/7 electronic perimeter surveillance",
      "Bonded customs clearance terminal for export",
    ],
    storageRatePerQtlMonth: 24,
    contactPhone: "+251 47 111 8840",
    managerName: "W/ro Tigist Hailu",
    wdraCertified: true,
  },
  {
    id: "wh-03",
    name: "Bure Integrated Agro-Industrial Park Silo",
    code: "ETH-WH-BUR-03",
    region: "Amhara",
    location: "Bure IAIP Logistics Center, Gojjam",
    totalCapacityMT: 40000,
    availableCapacityMT: 22000,
    facilities: [
      "Multi-grain intake pit with dust aspiration",
      "Optical color sorters for Teff and Sesame",
      "Direct rail & highway loading bay access",
      "Electronic Warehouse Receipt (e-NWR) issuer",
      "Commercial bank collateralized credit branch on-site",
    ],
    storageRatePerQtlMonth: 15,
    contactPhone: "+251 58 774 2090",
    managerName: "Ato Yared Kassahun",
    wdraCertified: true,
  },
  {
    id: "wh-04",
    name: "Hawassa Multi-Commodity Logistics Hub",
    code: "ETH-WH-HAW-04",
    region: "Sidama",
    location: "Hawassa Industrial Belt, Dry Port Road",
    totalCapacityMT: 25000,
    availableCapacityMT: 8400,
    facilities: [
      "Cold-chain pre-cooling units (0°C to 4°C)",
      "Dry bulk cereal & pulse bays",
      "Direct refrigerated reefer plug-ins for trucks",
      "ISO 22000 Food Safety certified premises",
    ],
    storageRatePerQtlMonth: 22,
    contactPhone: "+251 46 220 5412",
    managerName: "Ato Dawit Shiferaw",
    wdraCertified: true,
  },
  {
    id: "wh-05",
    name: "Kombolcha Northern Grain Terminal",
    code: "ETH-WH-KOM-05",
    region: "Amhara",
    location: "Kombolcha Dry Port Perimeter",
    totalCapacityMT: 35000,
    availableCapacityMT: 14700,
    facilities: [
      "Mechanized bagging and de-bagging lines",
      "Aflatoxin rapid ELISA testing laboratory",
      "CCTV surveillance with biometric warehouse access",
      "Direct link to national strategic food reserves",
    ],
    storageRatePerQtlMonth: 14,
    contactPhone: "+251 33 551 2940",
    managerName: "Ato Solomon Mengistu",
    wdraCertified: true,
  },
];

// ─────────────────────────────────────────────────────────────
// PRE-VERIFIED QUALITY ASSAY CERTIFICATES
// ─────────────────────────────────────────────────────────────
export const QUALITY_CERTIFICATES: QualityAssayReport[] = [
  {
    certificateNumber: "ECX-AS-2026-9041",
    commodity: "Export Grade Pure White Teff (Magna)",
    growerOrUnion: "Gemechu Desta / Oda Gida Agricultural Union",
    originWoreda: "Ada Woreda, East Shewa",
    region: "Oromia",
    lotSize: "150 Quintals (Shed Bay B)",
    assayDate: "16 October 2026",
    officialGrade: "ECX Grade 1",
    moistureContent: 11.2,
    purityScore: 99.2,
    foreignMatter: 0.4,
    defectRate: 0.4,
    oilOrProteinContent: "13.8% Protein Content",
    status: "VERIFIED",
    inspector: "Dr. Abera Kebede (MoA Chief Agronomist)",
  },
  {
    certificateNumber: "ECX-AS-2026-8812",
    commodity: "Sidama Washed Specialty Green Coffee Beans",
    growerOrUnion: "Wondwossen Bekele / Sidama Organic Coffee Union",
    originWoreda: "Dara Woreda, Sidama Zone",
    region: "Sidama",
    lotSize: "60 Bags (60kg Jute)",
    assayDate: "15 October 2026",
    officialGrade: "Export Q1 Specialty",
    moistureContent: 10.8,
    purityScore: 99.8,
    foreignMatter: 0.1,
    defectRate: 0.1,
    cupScore: 87.5,
    status: "VERIFIED",
    inspector: "Q-Grader Senait Tadesse (ECX Certified Lab)",
  },
  {
    certificateNumber: "ECX-AS-2026-7734",
    commodity: "Hard Amber Durum Wheat for Pasta Milling",
    growerOrUnion: "Tsegaye Alemu / Arsi Bale Grain Cooperative",
    originWoreda: "Sinana Woreda, Bale Zone",
    region: "Oromia",
    lotSize: "280 Quintals (Silo 4)",
    assayDate: "14 October 2026",
    officialGrade: "ECX Grade 1",
    moistureContent: 12.0,
    purityScore: 98.5,
    foreignMatter: 0.8,
    defectRate: 0.7,
    oilOrProteinContent: "14.2% Protein, 29% Wet Gluten",
    status: "VERIFIED",
    inspector: "Ins. Hailemariam Dessalegn (Bale Testing Post)",
  },
  {
    certificateNumber: "ECX-AS-2026-6621",
    commodity: "Whitish Humera Natural Sesame Seeds",
    growerOrUnion: "Mulugeta Haile / Northwest Farmers Syndicate",
    originWoreda: "Humera Lowlands, West Tigray",
    region: "Tigray",
    lotSize: "90 Quintals (Bay C)",
    assayDate: "17 October 2026",
    officialGrade: "ECX Grade 1",
    moistureContent: 6.2,
    purityScore: 99.0,
    foreignMatter: 0.6,
    defectRate: 0.4,
    oilOrProteinContent: "54.2% Oil Content (High Grade)",
    status: "VERIFIED",
    inspector: "Eng. Gebremedhin Berhe (Gondar Assay Center)",
  },
];

// Helper functions for localStorage syncing
export function getStoredAuctions(): AuctionTender[] {
  if (typeof window === "undefined") return INITIAL_AUCTIONS;
  try {
    const stored = localStorage.getItem("agri_auctions");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading stored auctions", e);
  }
  return INITIAL_AUCTIONS;
}

export function placeAuctionBid(auctionId: string, newBidAmount: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getStoredAuctions();
    const target = current.find((a) => a.id === auctionId);
    if (!target) return false;
    if (newBidAmount <= target.currentHighestBid) return false;

    const updated = current.map((a) =>
      a.id === auctionId
        ? {
            ...a,
            currentHighestBid: newBidAmount,
            totalBidsPlaced: a.totalBidsPlaced + 1,
          }
        : a
    );
    localStorage.setItem("agri_auctions", JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error("Error placing auction bid", e);
    return false;
  }
}
