import { fetchApi } from "./api";
import {
  MandiPrice,
  InputProduct,
  Wallet,
  WalletLedgerEntry,
  BidOffer,
  Shipment,
  Dispute,
  CropDoctorDiagnosis,
} from "@/types";

// ==========================================
// 1. MANDI BHAV (PRICE INFORMATION)
// ==========================================
export async function getMandiPrices(): Promise<MandiPrice[]> {
  try {
    const res = await fetchApi<MandiPrice[]>("/api/mandi-prices");
    if (res && res.data) return res.data;
  } catch (err) {
    console.warn("Failed to fetch mandi prices from backend, falling back to cached feed:", err);
  }
  return FALLBACK_MANDI_PRICES;
}

export const FALLBACK_MANDI_PRICES: MandiPrice[] = [
  {
    id: "mandi-1",
    commodityName: "White Teff",
    variety: "Magna Grade 1",
    mandiMarket: "Debre Birhan Mandi Terminal",
    stateRegion: "North Shewa",
    minPrice: 9200,
    maxPrice: 9650,
    modalPrice: 9400,
    unit: "Quintal (100kg)",
    arrivalVolumeQuintals: 3400,
    trend: "UP",
    recordedDate: "2026-10-24",
  },
  {
    id: "mandi-2",
    commodityName: "Arabica Coffee",
    variety: "Sidama Washed Q1",
    mandiMarket: "Hawassa Central Dry Port",
    stateRegion: "Sidama",
    minPrice: 27800,
    maxPrice: 29200,
    modalPrice: 28500,
    unit: "Bag (60kg)",
    arrivalVolumeQuintals: 1850,
    trend: "UP",
    recordedDate: "2026-10-24",
  },
  {
    id: "mandi-3",
    commodityName: "Durum Wheat",
    variety: "Hard Amber Grade A",
    mandiMarket: "Robe Grain Terminal Hub",
    stateRegion: "Bale",
    minPrice: 6000,
    maxPrice: 6400,
    modalPrice: 6200,
    unit: "Quintal (100kg)",
    arrivalVolumeQuintals: 5200,
    trend: "STABLE",
    recordedDate: "2026-10-24",
  },
  {
    id: "mandi-4",
    commodityName: "Hybrid Maize",
    variety: "Bako BH-540",
    mandiMarket: "Nekemte Central Mandi",
    stateRegion: "East Wollega",
    minPrice: 5600,
    maxPrice: 5950,
    modalPrice: 5850,
    unit: "Quintal (100kg)",
    arrivalVolumeQuintals: 4800,
    trend: "DOWN",
    recordedDate: "2026-10-24",
  },
  {
    id: "mandi-5",
    commodityName: "Red Haricot Beans",
    variety: "Export Grade",
    mandiMarket: "Bokoji Mandi Hub",
    stateRegion: "Arsi",
    minPrice: 7200,
    maxPrice: 7600,
    modalPrice: 7400,
    unit: "Quintal (100kg)",
    arrivalVolumeQuintals: 2100,
    trend: "UP",
    recordedDate: "2026-10-24",
  },
  {
    id: "mandi-6",
    commodityName: "White Humera Sesame",
    variety: "First Grade Natural",
    mandiMarket: "Humera Commodity Terminal",
    stateRegion: "Tigray / Amhara Border",
    minPrice: 14500,
    maxPrice: 15300,
    modalPrice: 14900,
    unit: "Quintal (100kg)",
    arrivalVolumeQuintals: 950,
    trend: "UP",
    recordedDate: "2026-10-24",
  },
];

// ==========================================
// 2. INPUT MARKETPLACE (SEEDS, FERTILISER, EQUIPMENT)
// ==========================================
export async function getInputProducts(category?: string): Promise<InputProduct[]> {
  try {
    const url = category && category !== "ALL" ? `/api/input-products?category=${category}` : "/api/input-products";
    const res = await fetchApi<InputProduct[]>(url);
    if (res && res.data) return res.data;
  } catch (err) {
    console.warn("Failed to fetch input products from backend, using fallback catalog:", err);
  }
  return FALLBACK_INPUTS;
}

export const FALLBACK_INPUTS: InputProduct[] = [
  {
    id: "inp-1",
    supplierName: "Ethio Agri-Inputs Enterprise",
    name: "Certified Bako Hybrid Maize Seed (BH-540)",
    category: "SEEDS",
    price: 420,
    unit: "10kg Bag",
    stockQuantity: 450,
    description: "High-yielding drought-tolerant hybrid seed certified by Ethiopian Institute of Agricultural Research (EIAR).",
    badge: "EIAR Certified",
    isOrganicCertified: false,
  },
  {
    id: "inp-2",
    supplierName: "Oromia Agricultural Cooperative Federation",
    name: "Granular Urea Nitrogen Fertiliser (46% N)",
    category: "FERTILISERS",
    price: 2850,
    unit: "50kg Bag",
    stockQuantity: 1200,
    description: "Premium slow-release agricultural nitrogen fertiliser for vigorous vegetative cereal growth.",
    badge: "Subsidized Price",
    isOrganicCertified: false,
  },
  {
    id: "inp-3",
    supplierName: "Arsi Bale Farmers Union",
    name: "Diammonium Phosphate (DAP 18-46-0)",
    category: "FERTILISERS",
    price: 3400,
    unit: "50kg Bag",
    stockQuantity: 850,
    description: "High phosphorus root stimulant for early plant development and grain fill.",
    badge: "Standard Formula",
    isOrganicCertified: false,
  },
  {
    id: "inp-4",
    supplierName: "Bio-Safe Organic Solutions",
    name: "Bio-Neem Botanical Pesticide (Cold-Pressed)",
    category: "PESTICIDES",
    price: 850,
    unit: "1 Litre Bottle",
    stockQuantity: 240,
    description: "Broad-spectrum organic neem extract controlling armyworms, aphids, and foliar beetles.",
    badge: "100% Organic",
    isOrganicCertified: true,
  },
  {
    id: "inp-5",
    supplierName: "Netafim Horn Agri-Tech",
    name: "Drip Line Micro-Irrigation Field Kit (0.25 Ha)",
    category: "EQUIPMENT",
    price: 18500,
    unit: "Complete Kit",
    stockQuantity: 35,
    description: "Water-saving gravity drip line kit including lateral pipes, drippers, screen filter, and connectors.",
    badge: "Water Saver",
    isOrganicCertified: false,
  },
];

// ==========================================
// 3. AGRIPAY WALLET & ESCROW LEDGER
// ==========================================
export async function getMyWallet(): Promise<Wallet> {
  try {
    const res = await fetchApi<Wallet>("/api/wallets/me");
    if (res && res.data) return res.data;
  } catch (err) {
    console.warn("Failed to fetch wallet from backend:", err);
  }
  return {
    id: "w-demo",
    userId: "u-demo",
    balance: 142000,
    escrowLocked: 0,
    currency: "ETB",
    updatedAt: new Date().toISOString(),
  };
}

export async function depositFunds(amount: number, referenceId?: string): Promise<Wallet> {
  const res = await fetchApi<Wallet>("/api/wallets/deposit", {
    method: "POST",
    body: JSON.stringify({ amount, referenceId }),
  });
  return res.data;
}

export async function withdrawFunds(amount: number, bankDetails?: string): Promise<Wallet> {
  const res = await fetchApi<Wallet>("/api/wallets/withdraw", {
    method: "POST",
    body: JSON.stringify({ amount, bankDetails }),
  });
  return res.data;
}

export async function getMyWalletLedger(): Promise<WalletLedgerEntry[]> {
  try {
    const res = await fetchApi<WalletLedgerEntry[]>("/api/wallets/ledger");
    if (res && res.data) return res.data;
  } catch (err) {
    console.warn("Failed to fetch user ledger:", err);
  }
  return [
    {
      id: "led-1",
      walletId: "w-demo",
      userId: "u-demo",
      entryType: "DEBIT",
      transactionType: "TRADE_PAYOUT",
      amount: 142000,
      balanceAfter: 142000,
      referenceId: "PAYOUT-781",
      description: "Proceeds released upon delivery acceptance of Durum Wheat Lot",
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function getAllWalletLedgers(): Promise<WalletLedgerEntry[]> {
  try {
    const res = await fetchApi<WalletLedgerEntry[]>("/api/admin/wallets/ledger");
    if (res && res.data) return res.data;
  } catch (err) {
    console.warn("Failed to fetch admin ledgers:", err);
  }
  return [];
}

// ==========================================
// 4. AUCTION & BIDDING ENGINE
// ==========================================
export async function getLotBids(lotId: string): Promise<BidOffer[]> {
  try {
    const res = await fetchApi<BidOffer[]>(`/api/bids/lot/${lotId}`);
    if (res && res.data) return res.data;
  } catch (err) {
    console.warn("Failed to fetch bids:", err);
  }
  return [];
}

export async function placeBidOrOffer(payload: {
  lotId: string;
  type: "AUCTION_BID" | "NEGOTIATION_OFFER" | "SELLER_COUNTER";
  amount: number;
  autoBidMax?: number;
  counterNote?: string;
}): Promise<BidOffer> {
  const res = await fetchApi<BidOffer>("/api/bids", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

// ==========================================
// 5. LOGISTICS & SHIPMENTS
// ==========================================
export async function getShipmentByOrder(orderId: string): Promise<Shipment | null> {
  try {
    const res = await fetchApi<Shipment>(`/api/shipments/order/${orderId}`);
    if (res && res.data) return res.data;
  } catch (err) {
    console.warn("Failed to fetch shipment:", err);
  }
  return null;
}

// ==========================================
// 6. DISPUTE RESOLUTION
// ==========================================
export async function getDisputes(): Promise<Dispute[]> {
  try {
    const res = await fetchApi<Dispute[]>("/api/disputes");
    if (res && res.data) return res.data;
  } catch (err) {
    console.warn("Failed to fetch disputes:", err);
  }
  return [];
}

export async function fileDispute(payload: {
  orderId: string;
  claimType: string;
  description: string;
  claimAmount?: number;
}): Promise<Dispute> {
  const res = await fetchApi<Dispute>("/api/disputes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function resolveDispute(
  disputeId: string,
  status: "RESOLVED_REFUND" | "RESOLVED_PARTIAL" | "DISMISSED",
  resolutionNotes?: string
): Promise<Dispute> {
  const res = await fetchApi<Dispute>(`/api/admin/disputes/${disputeId}/resolve`, {
    method: "PUT",
    body: JSON.stringify({ status, resolutionNotes }),
  });
  return res.data;
}

// ==========================================
// 7. CROP DOCTOR PATHOLOGY ENGINE
// ==========================================
export const CROP_DOCTOR_DATABASE: Record<string, CropDoctorDiagnosis[]> = {
  "Maize (Corn)": [
    {
      crop: "Maize (Corn)",
      issue: "Fall Armyworm (Spodoptera frugiperda)",
      severity: "CRITICAL",
      symptoms: [
        "Window-pane feeding holes on young maize leaves",
        "Sawdust-like moist frass in the plant whorl",
        "Ragged holes and chewed tassels",
      ],
      pathologyExplanation: "Invasive migratory pest that burrows into the whorl of maize, destroying the growing tip and drastically reducing ear count if untreated during early vegetative stages (V3-V8).",
      chemicalRemedy: "Apply Emamectin Benzoate 5% SG @ 0.4g/litre or Chlorantraniliprole 18.5% SC directed into the whorl early morning or evening.",
      organicRemedy: "Apply cold-pressed Bio-Neem 1500 ppm @ 3ml/litre, or dust dry wood ash / sand directly into whorls to suffocate young larvae.",
      applicationGuideline: "Rotate chemical active ingredients every 2 sprays to prevent pesticide resistance. Repeat after 10-14 days if moth flights persist.",
    },
    {
      crop: "Maize (Corn)",
      issue: "Maize Lethal Necrosis Disease (MLND)",
      severity: "CRITICAL",
      symptoms: [
        "Severe chlorotic mottle and yellowing along leaf margins",
        "Necrosis of young whorl leaves leading to 'dead heart'",
        "Deformed small cobs with zero seed fill",
      ],
      pathologyExplanation: "Synergistic viral infection caused by Maize Chlorotic Mottle Virus (MCMV) combined with Sugarcane Mosaic Virus (SCMV), vectored by corn thrips and flea beetles.",
      chemicalRemedy: "No direct viricide. Control vector insects using Imidacloprid 17.8% SL or Thiamethoxam spray immediately upon seeing thrips.",
      organicRemedy: "Uproot and burn infected plants immediately (rouging). Practice strict crop rotation with legumes (beans/cowpeas) for 2 seasons.",
      applicationGuideline: "Plant certified clean hybrid seed only (e.g. BH-540 treated with Gaucho). Disinfect harvesting tools.",
    },
  ],
  "White Teff": [
    {
      crop: "White Teff",
      issue: "Teff Head Smut (Ustilago teff)",
      severity: "MODERATE",
      symptoms: [
        "Dark soot-like powdery masses replacing grains on the panicle",
        "Stunted panicle elongation",
        "Brittle seed heads that shatter prematurely",
      ],
      pathologyExplanation: "Seed-borne fungal pathogen that infects teff panicles during early flowering stage under high morning humidity.",
      chemicalRemedy: "Seed dress before sowing with Thiram 75% WP @ 2.5g/kg seed or spray Tebuconazole 25.9% EC at early heading.",
      organicRemedy: "Soak teff seeds in hot water (52°C) for 10 minutes prior to sowing, followed by solar drying on clean canvas.",
      applicationGuideline: "Ensure broad seed spacing to improve canopy ventilation and reduce relative humidity in the standing crop.",
    },
    {
      crop: "White Teff",
      issue: "Teff Shoot Fly (Atherigona hyalinipennis)",
      severity: "HIGH",
      symptoms: [
        "Central seedling shoot dries out causing 'dead heart' at 2-3 leaf stage",
        "Excessive unproductive tillering from base",
        "Yellow wilted leaves on young seedlings",
      ],
      pathologyExplanation: "Larva burrows down between leaf sheath and stem, severing the growing point of young teff seedlings within 3 weeks of emergence.",
      chemicalRemedy: "Seed treat with Imidacloprid 600 FS @ 5ml/kg seed, or foliar spray Cypermethrin 10% EC @ 1ml/litre at 14 days after emergence.",
      organicRemedy: "Intercrop with non-host legumes or plant immediately at the onset of rains to outgrow the shoot fly population peak.",
      applicationGuideline: "Foliar sprays must be applied before larvae bore deep inside the shoot tissue.",
    },
  ],
  "Durum & Bread Wheat": [
    {
      crop: "Durum & Bread Wheat",
      issue: "Wheat Stripe / Yellow Rust (Puccinia striiformis)",
      severity: "CRITICAL",
      symptoms: [
        "Linear yellow-orange pustules arranged in parallel stripes along leaves",
        "Leaves become chlorotic and dry out rapidly",
        "Shrivelled grain with severe test weight reduction",
      ],
      pathologyExplanation: "Devastating airborne fungal disease thriving in cool highland climates (10-18°C) that defoliates wheat crops during grain filling.",
      chemicalRemedy: "Spray Propiconazole 25% EC @ 1ml/litre or Azoxystrobin + Difenoconazole SC at the very first sign of yellow stripes on lower leaves.",
      organicRemedy: "Plant certified rust-resistant wheat varieties (e.g., Kakaba, Danda'a). Avoid excessive nitrogen fertilizer.",
      applicationGuideline: "Timing is critical: spray during early morning before midday heat. Ensure complete lower canopy coverage.",
    },
  ],
  "Arabica Coffee": [
    {
      crop: "Arabica Coffee",
      issue: "Coffee Berry Disease (Colletotrichum kahawae)",
      severity: "CRITICAL",
      symptoms: [
        "Dark sunken anthracnose lesions on green expanding berries",
        "Berries turn black, dry into hollow mummies, and drop prematurely",
        "Flower cluster blight during heavy mist seasons",
      ],
      pathologyExplanation: "Aggressive fungal disease that attacks developing green berries during the wet rainy season (Kiremt), capable of destroying up to 80% of harvest if unprotected.",
      chemicalRemedy: "Copper Hydroxide 77% WP @ 3.5g/litre or Chlorothalonil 75% WP sprayed starting 3-4 weeks after flowering.",
      organicRemedy: "Foliar spray with Bordeaux mixture (1:1:100 copper sulfate and lime) and prune dense shade trees to allow morning sun penetration.",
      applicationGuideline: "Spray program must begin promptly at flowering and repeat at 4-week intervals during the rainy peak.",
    },
    {
      crop: "Arabica Coffee",
      issue: "Coffee Berry Borer (Hypothenemus hampei)",
      severity: "HIGH",
      symptoms: [
        "Tiny pin-sized entry holes near the tip/navel of green and ripe coffee cherries",
        "Premature cherry drop and bean hollow tunneling",
        "Powdery frass around the hole",
      ],
      pathologyExplanation: "Small scolytid beetle that tunnels into the endosperm of the coffee bean to lay eggs, drastically reducing physical grade and cup quality.",
      chemicalRemedy: "Beauveria bassiana bio-insecticide spray during flight periods (post-rain), or targeted Cypermethrin spray.",
      organicRemedy: "Hang Brocap traps baited with ethanol-methanol attractant (1:3 ratio) at 20 traps per hectare. Strict sanitation harvest of all dry mummies.",
      applicationGuideline: "Strip harvest all remaining dried cherries (mummies) from trees and ground after picking to break breeding cycle.",
    },
  ],
  "Red Haricot Beans": [
    {
      crop: "Red Haricot Beans",
      issue: "Bean Anthracnose (Colletotrichum lindemuthianum)",
      severity: "HIGH",
      symptoms: [
        "Dark brick-red to purplish-black lesions along leaf veins on undersides",
        "Circular sunken cankers with dark margins and pinkish gelatinous centers on bean pods",
        "Shrivelled stained seeds inside pods",
      ],
      pathologyExplanation: "Fungal disease transmitted through infected farm-saved seeds and rain splash, causing significant cosmetic and commercial grade rejection.",
      chemicalRemedy: "Seed treat with Carbendazim 50% WP @ 2g/kg seed. Foliar spray Mancozeb 75% WP @ 2.5g/litre at flowering.",
      organicRemedy: "Use 2-year crop rotation without legumes. Do not work in bean fields when foliage is wet from rain or dew.",
      applicationGuideline: "Never save seeds from an anthracnose-infected crop for the next planting season.",
    },
  ],
};

// ==========================================
// 8. FERTILISER CALCULATOR ENGINE
// ==========================================
export interface FertiliserCalculationResult {
  crop: string;
  landArea: number;
  areaUnit: "Hectare" | "Acre" | "Timad (0.25 Ha)";
  ureaBags50kg: number;
  dapBags50kg: number;
  compostQuintals: number;
  totalKgUrea: number;
  totalKgDap: number;
  estimatedCostETB: number;
  basalApplicationDap: string;
  firstTopDressingUrea: string;
  secondTopDressingUrea: string;
  agronomyAdvice: string;
}

export function calculateFertiliserRequirements(
  crop: string,
  landArea: number,
  areaUnit: "Hectare" | "Acre" | "Timad (0.25 Ha)",
  soilFertility: "LOW" | "MEDIUM" | "HIGH"
): FertiliserCalculationResult {
  // Convert area to Hectares for base agronomic calculation
  let ha = landArea;
  if (areaUnit === "Acre") ha = landArea * 0.404686;
  if (areaUnit === "Timad (0.25 Ha)") ha = landArea * 0.25;

  let baseUreaKgPerHa = 100;
  let baseDapKgPerHa = 100;
  let compostQuintalsPerHa = 20;

  if (crop === "Maize (Corn)") {
    baseUreaKgPerHa = 150;
    baseDapKgPerHa = 100;
    compostQuintalsPerHa = 25;
  } else if (crop === "White Teff") {
    baseUreaKgPerHa = 60;
    baseDapKgPerHa = 100;
    compostQuintalsPerHa = 15;
  } else if (crop === "Durum Wheat") {
    baseUreaKgPerHa = 120;
    baseDapKgPerHa = 100;
    compostQuintalsPerHa = 20;
  } else if (crop === "Arabica Coffee") {
    baseUreaKgPerHa = 200;
    baseDapKgPerHa = 150;
    compostQuintalsPerHa = 40;
  } else if (crop === "Red Haricot Beans") {
    // Legumes fix nitrogen
    baseUreaKgPerHa = 30;
    baseDapKgPerHa = 100;
    compostQuintalsPerHa = 10;
  }

  // Fertility modifier
  const modifier = soilFertility === "LOW" ? 1.2 : soilFertility === "HIGH" ? 0.8 : 1.0;
  const totalKgUrea = Math.round(baseUreaKgPerHa * ha * modifier);
  const totalKgDap = Math.round(baseDapKgPerHa * ha * modifier);
  const compostQuintals = Math.round(compostQuintalsPerHa * ha);

  const ureaBags50kg = Math.ceil(totalKgUrea / 50);
  const dapBags50kg = Math.ceil(totalKgDap / 50);

  // Subsidized ETB price: Urea ~ 2,850 ETB / 50kg bag, DAP ~ 3,400 ETB / 50kg bag
  const estimatedCostETB = ureaBags50kg * 2850 + dapBags50kg * 3400;

  return {
    crop,
    landArea,
    areaUnit,
    ureaBags50kg,
    dapBags50kg,
    compostQuintals,
    totalKgUrea,
    totalKgDap,
    estimatedCostETB,
    basalApplicationDap: `Apply all ${totalKgDap} kg of DAP (18-46-0) at planting time, placed 5cm below and 5cm beside the seed furrow.`,
    firstTopDressingUrea: `Apply ${Math.round(totalKgUrea * 0.5)} kg of Urea (46% N) at 30-35 days after planting (knee-high stage or first weeding) when soil is moist.`,
    secondTopDressingUrea: `Apply remaining ${Math.round(totalKgUrea * 0.5)} kg of Urea right before flowering / tassel emergence. Avoid dry soil broadcasting.`,
    agronomyAdvice: `Applying ${compostQuintals} quintals of well-cured farmyard manure improves organic matter and increases DAP phosphorus uptake efficiency by up to 28%.`,
  };
}

// ==========================================
// 9. AGRIBHUMI / AGRIKNOW SATELLITE TELEMETRY
// ==========================================
export interface SatelliteAdvisoryTelemetry {
  region: string;
  mandiHub: string;
  ndviIndex: number;
  ndviStatus: "EXCELLENT" | "GOOD" | "MODERATE" | "STRESSED";
  soilMoisturePercent: number;
  soilMoistureStatus: "OPTIMAL" | "ADEQUATE" | "DEFICIT";
  precipitationForecastMm: number;
  sprayCondition: "FAVORABLE" | "UNFAVORABLE_RAIN" | "WIND_HAZARD";
  irrigationGuidance: string;
  upcomingWeatherAlert: string;
}

export function getRegionalSatelliteTelemetry(region: string): SatelliteAdvisoryTelemetry {
  const map: Record<string, SatelliteAdvisoryTelemetry> = {
    "North Shewa": {
      region: "North Shewa Highland Plateau",
      mandiHub: "Debre Birhan Mandi Terminal",
      ndviIndex: 0.76,
      ndviStatus: "EXCELLENT",
      soilMoisturePercent: 32.4,
      soilMoistureStatus: "OPTIMAL",
      precipitationForecastMm: 12.5,
      sprayCondition: "FAVORABLE",
      irrigationGuidance: "Soil moisture is optimal from Meher rains. No supplemental irrigation needed this week.",
      upcomingWeatherAlert: "Light scattered highland frost possible at night (temperatures dipping to 6°C). Avoid late evening irrigation.",
    },
    Sidama: {
      region: "Sidama Highland Agro-Forestry",
      mandiHub: "Hawassa Central Dry Port",
      ndviIndex: 0.82,
      ndviStatus: "EXCELLENT",
      soilMoisturePercent: 38.1,
      soilMoistureStatus: "OPTIMAL",
      precipitationForecastMm: 24.0,
      sprayCondition: "UNFAVORABLE_RAIN",
      irrigationGuidance: "High rain expected in next 48 hours. Postpone foliar spraying of coffee rust fungicides to avoid wash-off.",
      upcomingWeatherAlert: "Heavy afternoon thunderstorms forecast for Thursday. Secure drying beds with waterproof polyethylene tarps.",
    },
    Bale: {
      region: "Bale Highland Grain Plains",
      mandiHub: "Robe Grain Terminal Hub",
      ndviIndex: 0.71,
      ndviStatus: "GOOD",
      soilMoisturePercent: 28.6,
      soilMoistureStatus: "ADEQUATE",
      precipitationForecastMm: 4.0,
      sprayCondition: "FAVORABLE",
      irrigationGuidance: "Clear skies and moderate winds. Ideal window for top-dressing urea on durum wheat fields.",
      upcomingWeatherAlert: "Stable dry spell expected for 5 consecutive days. Excellent conditions for field curing and grain storage prep.",
    },
    "East Wollega": {
      region: "East Wollega Maize Belt",
      mandiHub: "Nekemte Central Mandi",
      ndviIndex: 0.68,
      ndviStatus: "GOOD",
      soilMoisturePercent: 29.5,
      soilMoistureStatus: "ADEQUATE",
      precipitationForecastMm: 8.0,
      sprayCondition: "FAVORABLE",
      irrigationGuidance: "Optimal field conditions for armyworm scouting and targeted bio-neem spray before 10:00 AM.",
      upcomingWeatherAlert: "Moderate humidity overnight (78%). Maintain aeration fans in commercial silo storages.",
    },
  };

  return map[region] || map["North Shewa"];
}

// ==========================================
// 10. KISAN SAFALTA FINANCE (SEASONAL CREDIT)
// ==========================================
export interface KisanCreditOffer {
  farmerName: string;
  landHectares: number;
  creditLimitETB: number;
  interestRateAnnual: number;
  gracePeriodDays: number;
  harvestSettlementDate: string;
  availableCreditETB: number;
  status: "APPROVED" | "PENDING_KYC" | "DISBURSED";
}

export function getFarmerCreditOffer(farmerName: string, landHectares: number = 3.5): KisanCreditOffer {
  const creditLimitETB = Math.round(landHectares * 25000); // 25,000 ETB per hectare seasonal credit
  return {
    farmerName,
    landHectares,
    creditLimitETB,
    interestRateAnnual: 9.5,
    gracePeriodDays: 90, // 0% interest for first 90 days until harvest
    harvestSettlementDate: "December 30, 2026",
    availableCreditETB: creditLimitETB,
    status: "APPROVED",
  };
}
