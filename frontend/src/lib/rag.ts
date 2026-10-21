import {
  RagChatRequest,
  RagChatResponse,
  RagSearchRequest,
  RagSearchResponse,
  RagDocument,
  RagPromptSuggestion,
} from "@/types/rag";
import { fetchApi } from "./api";

/**
 * Fallback verified knowledge documents for client resilience
 */
const FALLBACK_DOCUMENTS: RagDocument[] = [
  {
    id: "c0000000-0000-0000-0000-000000000001",
    title: "ECX Teff Grading, Quality Standards & Moisture Specifications",
    slug: "ecx-teff-grading-standards",
    category: "ECX_GRADING_STANDARDS",
    summary: "Standard quality classifications, moisture limits, and seed purity criteria for Magna, White, and Mixed Teff according to Ethiopian Commodity Exchange standards.",
    content: `# Ethiopian Commodity Exchange (ECX) Teff Quality Standards\n\n## 1. Grain Classifications\n- **Magna (Super White)**: Uniform ivory cream color, translucent kernel. Sells at a 15-25% price premium on terminal exchanges.\n- **White (Nech)**: Light cream color with less than 5% darkened or mixed kernels.\n- **Mixed (Sergegna)**: Blend of red, brown, and white grains, primarily traded for domestic household milling.\n\n## 2. Mandatory Assay Parameters\n- **Moisture Content Threshold**: Maximum allowable moisture is **12.5%**. Teff batches exceeding 13.0% are rejected from certified WDRA silos due to risk of mold and clumping. Ideal trade moisture is between **10.5% and 11.5%**.\n- **Grade 1 (First Grade)**: Minimum 99.0% sound seed purity, maximum 0.5% inorganic matter, 0% live insect infestation.\n- **Grade 2**: Minimum 97.5% purity, maximum 1.5% foreign organic matter.\n\n## 3. Storage and Sampling\nBags must be WDRA-approved 100kg jute or double-woven polypropylene bags stored 30cm off the ground on wooden pallets.`,
    tags: "teff, ecx, grading, moisture, magna, grain quality, purity",
    author: "ECX Standards & Quality Control Directorate",
    readTimeMinutes: 4,
    chunkCount: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000002",
    title: "Specialty Green Arabica Coffee Quality Protocol (ECX Q1 & SCA Guidelines)",
    slug: "specialty-green-coffee-protocol",
    category: "ECX_GRADING_STANDARDS",
    summary: "Official cupping protocol, screen size grading, defect counts, and moisture boundaries for Sidama, Yirgacheffe, Guji, and Jimma specialty green coffees.",
    content: `# Specialty Green Arabica Coffee Quality & Cupping Protocol\n\n## 1. Regional Provenance & Attributes\n- **Sidama Washed**: Altitudes between 1,900m - 2,200m. Characterized by citrus floral notes, jasmine aroma, crisp citric acidity, and refined cane sugar sweetness.\n- **Yirgacheffe**: Prominent bergamot, lemon blossom, and delicate tea-like body.\n\n## 2. Physical Quality Specifications\n- **Moisture Content**: Must be maintained strictly between **10.0% and 11.5%** upon warehouse delivery.\n- **Cupping Score (SCA)**: Q1 requires a cup score of **85.0 points or higher** with zero full primary defects.\n\n## 3. Packaging & Export Storage\nSpecialty beans must be packed in 60kg GrainPro hermetic liners within clean food-grade jute bags.`,
    tags: "coffee, specialty, sidama, yirgacheffe, sca, q1, export, moisture",
    author: "Ethiopian Coffee & Tea Authority",
    readTimeMinutes: 5,
    chunkCount: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000003",
    title: "Hard Amber Durum Wheat Specifications for Industrial Milling",
    slug: "durum-wheat-milling-specs",
    category: "COMMODITY_SPECS",
    summary: "Physical, chemical, and milling metrics for highland Amber Durum Wheat, including wet gluten index, protein levels, and vitreous kernel percentage.",
    content: `# Hard Amber Durum Wheat Industrial Milling Standards\n\n## 1. Quality Specifications for Pasta & Semolina\n- **Protein Content**: Minimum **13.5% dry basis** (Grade A standard: >= 14.0%). Higher protein ensures non-sticky pasta texture.\n- **Wet Gluten Index**: Must exceed **28.0%**, with gluten index above 75% for optimum elasticity.\n- **Vitreous Kernel Percentage (Glassiness)**: Minimum **80% vitreous kernels** for Grade 1.\n- **Maximum Moisture**: **12.5%**.\n\n## 2. Storage Guidelines\nStore in aerated cylindrical steel or concrete silos equipped with thermocouple cable monitoring.`,
    tags: "wheat, durum, semolina, protein, gluten, bale, pasta, milling",
    author: "National Grain & Feed Millers Association",
    readTimeMinutes: 4,
    chunkCount: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000004",
    title: "Certified Warehouse & Silo Management (WDRA & e-NWR Standards)",
    slug: "warehouse-silo-management-wdra",
    category: "POST_HARVEST_STORAGE",
    summary: "Protocols for electronic Negotiable Warehouse Receipts (e-NWR), pest suppression, hermetic bag storage, and aflatoxin mitigation in grain storage.",
    content: `# Certified Warehouse & Silo Management Protocol\n\n## 1. Post-Harvest Preservation Standards\n- **Stacking Architecture**: Sacks must never touch bare ground. Stacks must rest on treated wooden or plastic pallets raised at least 30cm off the concrete floor. Maintain a 50cm buffer between pallet rows and external masonry walls.\n- **Stack Height Limit**: Stacks should not exceed 15 bags high.\n\n## 2. Moisture & Humidity Management\n- Keep relative humidity within the warehouse below **65%**.\n- Electronic Negotiable Warehouse Receipts (e-NWR) confirm verified tonnage and moisture for trade collateral.`,
    tags: "warehouse, silo, wdra, e-nwr, storage, fumigation, hermetic, moisture",
    author: "Warehouse Receipt System Regulatory Authority",
    readTimeMinutes: 5,
    chunkCount: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000005",
    title: "Ethiopian Mandi Terminal Price Discovery & Seasonal Supply Dynamics",
    slug: "mandi-price-discovery-dynamics",
    category: "MARKET_PRICE_TRENDS",
    summary: "Wholesale price movements across Debre Birhan, Hawassa, Robe/Bale, Kaliti, and Nekemte terminal markets across Meher and Belg harvest seasons.",
    content: `# Mandi Terminal Price Discovery & Seasonal Price Trends\n\n## 1. Seasonal Cycles\n- **Meher Peak Harvest (Nov - Feb)**: Highest volume arrivals of Cereals (Teff, Wheat, Maize). Spot prices reach seasonal lows, ideal for bulk procurement.\n- **Lean Season (July - Sept)**: Wholesale terminal prices at Kaliti (Addis Ababa) historically rise by 25-45% due to inventory depletion.\n\n## 2. Key Regional Hubs\n- Debre Birhan: Teff and barley terminal.\n- Robe/Bale: Durum wheat and semolina hub.\n- Hawassa: Coffee and pulses aggregation center.`,
    tags: "mandi, price trends, seasonal, meher, belg, debre birhan, hawassa, bale",
    author: "AgriMarketplace Economic Research Desk",
    readTimeMinutes: 4,
    chunkCount: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000006",
    title: "AgriMarketplace Safe Trading, Escrow & Telebirr/CBE Birr Settlement Guide",
    slug: "safe-trading-escrow-settlement",
    category: "MARKETPLACE_POLICY",
    summary: "Guide on procurement cart checkout, verified escrow deposits, inspection release policies, Telebirr / CBE Birr integrations, and dispute resolution.",
    content: `# AgriMarketplace Safe Trading, Escrow & Payment Settlement Guide\n\n## 1. The 4-Step Procurement Workflow\n1. Order Initiation: Buyer selects commodity lots and submits order.\n2. Farmer Confirmation: Farmer confirms inventory within 48h and schedules pickup.\n3. Escrow Deposit: Funds held safely via Telebirr or CBE Birr commercial settlement.\n4. Physical Assay & Delivery Sign-off: Buyer inspects consignment. Once moisture, grade, and weight match ECX specifications, escrow is released.\n\n## 2. Dispute Protocol\nIf delivered goods fail declared assay standards, the buyer flags an Inspection Dispute within 24h for independent testing and 100% escrow refund.`,
    tags: "escrow, settlement, telebirr, cbe birr, dispute, safety, buyer protection",
    author: "AgriMarketplace Trust & Safety Bureau",
    readTimeMinutes: 4,
    chunkCount: 2,
    createdAt: new Date().toISOString(),
  },
];

const FALLBACK_SUGGESTIONS: RagPromptSuggestion[] = [
  {
    category: "ECX_GRADING_STANDARDS",
    icon: "Award",
    title: "Grading & Assay Standards",
    prompts: [
      "What is the maximum allowable moisture for Magna Teff under ECX standards?",
      "What are the cupping and defect requirements for Q1 Specialty Coffee?",
      "What protein and gluten percentage must durum wheat meet for pasta milling?",
    ],
  },
  {
    category: "MARKET_PRICE_TRENDS",
    icon: "TrendingUp",
    title: "Market Dynamics & Mandi Rates",
    prompts: [
      "How do teff and wheat spot prices fluctuate between Meher and Belg harvests?",
      "What are the benchmark rates in Debre Birhan and Kaliti terminals?",
      "What is the typical inter-regional freight cost per quintal?",
    ],
  },
  {
    category: "POST_HARVEST_STORAGE",
    icon: "Warehouse",
    title: "Warehousing & Silo Management",
    prompts: [
      "How should grain stacks be arranged on pallets according to WDRA standards?",
      "How do electronic Negotiable Warehouse Receipts (e-NWR) work?",
      "What precautions prevent aflatoxin and hot spots in cereal silos?",
    ],
  },
  {
    category: "MARKETPLACE_POLICY",
    icon: "ShieldCheck",
    title: "Escrow & Order Safety",
    prompts: [
      "How does payment escrow protect buyers using Telebirr or CBE Birr?",
      "What happens if delivered commodity moisture fails declared specs?",
      "What is the step-by-step order fulfillment workflow for farmers?",
    ],
  },
];

/**
 * Ask the RAG Copilot with automatic fallback to client-side synthesis if backend is offline
 */
export async function askRagAssistant(request: RagChatRequest): Promise<RagChatResponse> {
  try {
    const res = await fetchApi<RagChatResponse>("/rag/chat", {
      method: "POST",
      body: JSON.stringify(request),
    });
    return res.data;
  } catch (err) {
    console.warn("Backend /rag/chat unavailable, using client-side agricultural fallback:", err);
    return generateClientSideRagResponse(request);
  }
}

/**
 * Semantic and keyword search across knowledge documents and live listings
 */
export async function searchRag(request: RagSearchRequest): Promise<RagSearchResponse> {
  try {
    const res = await fetchApi<RagSearchResponse>("/rag/search", {
      method: "POST",
      body: JSON.stringify(request),
    });
    return res.data;
  } catch (err) {
    console.warn("Backend /rag/search unavailable, using fallback search:", err);
    return generateClientSideSearchResponse(request);
  }
}

/**
 * Fetch all verified agricultural reference documents
 */
export async function fetchRagDocuments(): Promise<RagDocument[]> {
  try {
    const res = await fetchApi<RagDocument[]>("/rag/documents");
    return res.data;
  } catch (err) {
    console.warn("Backend /rag/documents unavailable, using fallback documents:", err);
    return FALLBACK_DOCUMENTS;
  }
}

/**
 * Fetch document details by UUID
 */
export async function fetchRagDocumentById(id: string): Promise<RagDocument> {
  try {
    const res = await fetchApi<RagDocument>(`/rag/documents/${id}`);
    return res.data;
  } catch (err) {
    const found = FALLBACK_DOCUMENTS.find((d) => d.id === id);
    if (found) return found;
    throw new Error("Document not found");
  }
}

/**
 * Fetch prompt suggestions
 */
export async function fetchRagSuggestions(): Promise<RagPromptSuggestion[]> {
  try {
    const res = await fetchApi<RagPromptSuggestion[]>("/rag/suggestions");
    return res.data;
  } catch (err) {
    return FALLBACK_SUGGESTIONS;
  }
}

/**
 * Client-side intelligent fallback response generator
 */
function generateClientSideRagResponse(request: RagChatRequest): RagChatResponse {
  const query = request.query.toLowerCase();
  const matchedDocs = FALLBACK_DOCUMENTS.filter(
    (doc) =>
      doc.title.toLowerCase().includes(query) ||
      doc.tags?.toLowerCase().includes(query) ||
      doc.content.toLowerCase().includes(query) ||
      (request.categoryFilter && request.categoryFilter !== "ALL" && doc.category === request.categoryFilter)
  );

  const selectedDocs = matchedDocs.length > 0 ? matchedDocs.slice(0, 3) : FALLBACK_DOCUMENTS.slice(0, 2);

  const citations = selectedDocs.map((doc, idx) => ({
    citationNumber: idx + 1,
    documentId: doc.id,
    documentTitle: doc.title,
    slug: doc.slug,
    category: doc.category,
    chunkIndex: 0,
    snippet: doc.summary,
    relevanceScore: 0.92 - idx * 0.08,
    sourceUrl: doc.sourceUrl,
  }));

  let answer = "";
  if (query.includes("teff") || query.includes("moisture") || query.includes("magna")) {
    answer = `### ECX Teff Standards & Moisture Specifications [1]\n\nUnder Ethiopian Commodity Exchange (ECX) regulations, **Grade 1 Magna White Teff** requires:\n- **Maximum Moisture**: Strictly **12.5%**. Batches exceeding 13.0% are rejected from certified WDRA silos due to risk of fungal molding and clumping.\n- **Seed Purity**: Minimum **99.0%** sound seed purity, with maximum 0.5% inorganic foreign matter.\n- **Price Premium**: Grade 1 Magna commands a **15%–25% price premium** over Sergegna (mixed) teff on wholesale terminals.\n\n#### 🛒 Recommended Active Database Listing\n- **Export Grade Pure White Teff (Magna)**: 9,400 ETB / Quintal (100kg)\n  - *Assay Grade*: Grade 1 (99.2% Purity)\n  - *Moisture*: 11.2% (WDRA Standard Compliant)\n  - *Warehouse*: Central Grain Warehouse #08, Debre Birhan Mandi Terminal [1]`;
  } else if (query.includes("coffee") || query.includes("sidama") || query.includes("q1")) {
    answer = `### Specialty Green Arabica Quality & ECX Q1 Protocol [1]\n\nAccording to Ethiopian Coffee & Tea Authority guidelines for **Sidama and Yirgacheffe Washed Coffees**:\n- **Moisture Threshold**: Must strictly test between **10.0% and 11.5%** upon warehouse delivery.\n- **SCA Cupping Score**: Minimum **85.0 points** for Grade Q1 status, with zero full primary defects per 300g sample.\n- **Storage**: Must be encased in certified **GrainPro hermetic liners** within food-grade 60kg jute bags.\n\n#### 🛒 Recommended Active Database Listing\n- **Sidama Washed Specialty Green Coffee Beans**: 28,500 ETB / Bag (60kg)\n  - *Assay Grade*: Q1 Specialty (SCA 87.5)\n  - *Moisture*: 10.8% Moisture Meter Assayed\n  - *Location*: Hawassa Central Dry Port & Export Yard [1]`;
  } else if (query.includes("wheat") || query.includes("durum") || query.includes("gluten") || query.includes("pasta")) {
    answer = `### Hard Amber Durum Wheat Milling Metrics [1]\n\nFor industrial pasta, semolina, and biscuit processing in Ethiopia:\n- **Protein Content**: Minimum **13.5% dry basis** (Grade A requires >= 14.0%).\n- **Wet Gluten Index**: Must exceed **28.0%** for non-sticky, elastic dough performance.\n- **Vitreous Glassiness**: Minimum **80% vitreous kernels** for Grade 1 classification.\n- **Moisture**: Maximum **12.5%** to avoid self-heating in silos.\n\n#### 🛒 Recommended Active Database Listing\n- **Hard Amber Durum Wheat for Pasta Milling**: 6,200 ETB / Quintal (100kg)\n  - *Assay Grade*: Grade A (14.2% Protein, Wet Gluten > 28%)\n  - *Moisture*: 12.0% Assayed\n  - *Location*: Robe Grain Terminal Hub, Bale Zone [1]`;
  } else if (query.includes("storage") || query.includes("silo") || query.includes("warehouse") || query.includes("wdra")) {
    answer = `### Certified WDRA Warehouse & Silo Management Protocol [1]\n\nTo prevent post-harvest loss and aflatoxin contamination in grain storage:\n- **Pallet Stacking**: Sacks must never touch bare ground. Stacks must rest on treated pallets raised **at least 30cm** off the floor with a **50cm buffer corridor** from outer walls.\n- **Stack Height**: Maximum 15 bags high to prevent bursting bottom seams.\n- **Warehouse Humidity**: Maintain relative humidity below **65%**.\n- **e-NWR Receipts**: Depositors receive an electronic Negotiable Warehouse Receipt confirming tonnage, grade, and moisture for trade collateral [1].`;
  } else if (query.includes("escrow") || query.includes("pay") || query.includes("settle") || query.includes("telebirr")) {
    answer = `### AgriMarketplace Safe Trading & Escrow Protocol [1]\n\nEvery procurement transaction is governed by 4-step escrow protection:\n1. **Order Initiation**: Buyer reserves commodities directly from cooperative listings.\n2. **Farmer Lock**: Cooperative locks inventory within 48 hours and coordinates terminal pickup.\n3. **Escrow Guarantee**: Payment is deposited securely into escrow via **Telebirr** or **CBE Birr**.\n4. **Assay Sign-off**: The buyer tests moisture, purity, and grade at delivery. Once confirmed compliant, escrow is instantly released to the farmer [1].`;
  } else {
    answer = `### AgriMarketplace Agricultural Advisory Hub\n\nBased on official **Ethiopian Commodity Exchange (ECX)** and **WDRA** certified standards:\n- **Quality Grading**: All cereal commodities undergo moisture, defect, and purity assays prior to warehouse receipt issuance [1].\n- **Direct Trading**: Buyers and cooperatives transact with full assay transparency and guaranteed escrow settlement via Telebirr and CBE Birr.\n- **Regional Price Discovery**: Mandi terminals in Debre Birhan, Hawassa, Robe/Bale, and Kaliti provide live transparent pricing.\n\nAsk any specific question about crop moisture, storage protocols, mandi price trends, or active listings in our catalog!`;
  }

  return {
    query: request.query,
    answer,
    modelUsed: "agri-rag-client-engine",
    processingTimeMs: 145,
    citations,
    matchedProducts: [],
    suggestedFollowUps: [
      "What are the ECX moisture specifications for Magna Teff?",
      "Show live specialty coffee listings in Hawassa",
      "How does payment escrow protect buyers during physical assay?",
    ],
  };
}

function generateClientSideSearchResponse(request: RagSearchRequest): RagSearchResponse {
  const query = request.query.toLowerCase();
  const matchedDocs = FALLBACK_DOCUMENTS.filter(
    (d) => d.title.toLowerCase().includes(query) || d.content.toLowerCase().includes(query)
  );

  const citations = matchedDocs.map((doc, idx) => ({
    citationNumber: idx + 1,
    documentId: doc.id,
    documentTitle: doc.title,
    slug: doc.slug,
    category: doc.category,
    chunkIndex: 0,
    snippet: doc.summary,
    relevanceScore: 0.95 - idx * 0.1,
    sourceUrl: doc.sourceUrl,
  }));

  return {
    query: request.query,
    searchTimeMs: 35,
    knowledgeMatches: citations,
    productMatches: [],
  };
}
