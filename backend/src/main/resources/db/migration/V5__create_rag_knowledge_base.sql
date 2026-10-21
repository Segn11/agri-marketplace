-- Migration V5: Create RAG Knowledge Base and Agricultural Reference Library
-- Tables for Retrieval-Augmented Generation (RAG): Documents and Vector/Text Chunks

-- 1. Knowledge Base Documents Table
CREATE TABLE IF NOT EXISTS rag_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT,
    author VARCHAR(150) DEFAULT 'AgriMarketplace Research Hub',
    source_url VARCHAR(500),
    read_time_minutes INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Document Chunks Table for Semantic Retrieval & Vector Indexing
CREATE TABLE IF NOT EXISTS rag_document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES rag_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    metadata_json TEXT,
    embedding_vector TEXT,
    token_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes for High Performance RAG Queries
CREATE INDEX IF NOT EXISTS idx_rag_docs_category ON rag_documents(category);
CREATE INDEX IF NOT EXISTS idx_rag_docs_slug ON rag_documents(slug);
CREATE INDEX IF NOT EXISTS idx_rag_chunks_doc_id ON rag_document_chunks(document_id);

-- 4. Initial Seed of Verified Agricultural Knowledge Base Documents
INSERT INTO rag_documents (id, title, slug, category, summary, content, tags, author, source_url, read_time_minutes)
VALUES
(
    'c0000000-0000-0000-0000-000000000001'::uuid,
    'ECX Teff Grading, Quality Standards & Moisture Specifications',
    'ecx-teff-grading-standards',
    'ECX_GRADING_STANDARDS',
    'Standard quality classifications, moisture limits, and seed purity criteria for Magna, White, and Mixed Teff according to Ethiopian Commodity Exchange standards.',
    '# Ethiopian Commodity Exchange (ECX) Teff Quality Standards

## 1. Grain Classifications
Teff (Eragrostis tef) is graded into distinct market commercial classes:
- **Magna (Super White)**: Uniform ivory cream color, translucent kernel. Sells at a 15-25% price premium on terminal exchanges.
- **White (Nech)**: Light cream color with less than 5% darkened or mixed kernels.
- **Mixed (Sergegna)**: Blend of red, brown, and white grains, primarily traded for domestic household milling.
- **Brown/Red (Qey)**: Dark reddish-brown kernels, exceptionally high iron content, widely utilized for traditional sourdough fermentations.

## 2. Mandatory Assay Parameters
- **Moisture Content Threshold**: Maximum allowable moisture is **12.5%**. Teff batches exceeding 13.0% are rejected from certified WDRA silos due to risk of mold and clumping. Ideal trade moisture is between **10.5% and 11.5%**.
- **Grade 1 (First Grade)**: Minimum 99.0% sound seed purity, maximum 0.5% inorganic matter, 0% live insect infestation.
- **Grade 2**: Minimum 97.5% purity, maximum 1.5% foreign organic matter.
- **Grade 3**: Minimum 95.0% purity, acceptable for commercial livestock feed or immediate industrial processing.

## 3. Storage and Sampling
Samples must be extracted using a multi-chamber grain probe trier across at least 10% of bagged lots. Bags must be WDRA-approved 100kg jute or double-woven polypropylene bags stored 30cm off the ground on wooden pallets.',
    'teff, ecx, grading, moisture, magna, grain quality, purity',
    'ECX Standards & Quality Control Directorate',
    'https://ecx.com.et/standards/cereals/teff',
    4
),
(
    'c0000000-0000-0000-0000-000000000002'::uuid,
    'Specialty Green Arabica Coffee Quality Protocol (ECX Q1 & SCA Guidelines)',
    'specialty-green-coffee-protocol',
    'ECX_GRADING_STANDARDS',
    'Official cupping protocol, screen size grading, defect counts, and moisture boundaries for Sidama, Yirgacheffe, Guji, and Jimma specialty green coffees.',
    '# Specialty Green Arabica Coffee Quality & Cupping Protocol

## 1. Regional Provenance & Attributes
- **Sidama Washed**: Altitudes between 1,900m - 2,200m. Characterized by citrus floral notes, jasmine aroma, crisp citric acidity, and refined cane sugar sweetness.
- **Yirgacheffe**: Prominent bergamot, lemon blossom, and delicate tea-like body.
- **Guji Natural**: Intensely fruity, wild strawberry, blueberry jam, and velvety chocolate finish.
- **Jimma / Limu**: Balanced spiced chocolate, winey acidity, and rich syrupy body.

## 2. Physical Quality Specifications
- **Moisture Content**: Must be maintained strictly between **10.0% and 11.5%** upon warehouse delivery. Moisture over 12.0% risks mold contamination, while moisture below 9.5% damages embryo vitality and cup complexity.
- **Screen Size**: Screen 14 and above (minimum 85% retention on 14/64-inch round perforations).
- **Primary Defects**: Grade 1 (Q1) permits zero full primary defects (black beans, sour beans, pod cherry, foreign stones). Secondary defects must count under 3 per 300g sample.
- **Cupping Score (SCA)**: Q1 requires a cup score of **85.0 points or higher**. Grade 2 requires **80.0 to 84.75 points**.

## 3. Packaging & Export Storage
Specialty beans must be packed in 60kg GrainPro hermetic liners within clean food-grade jute bags to prevent moisture absorption and aromatic loss during maritime transport.',
    'coffee, specialty, sidama, yirgacheffe, sca, q1, export, moisture',
    'Ethiopian Coffee & Tea Authority',
    'https://ectadc.gov.et/quality-standards',
    5
),
(
    'c0000000-0000-0000-0000-000000000003'::uuid,
    'Hard Amber Durum Wheat Specifications for Industrial Milling',
    'durum-wheat-milling-specs',
    'COMMODITY_SPECS',
    'Physical, chemical, and milling metrics for highland Amber Durum Wheat, including wet gluten index, protein levels, and vitreous kernel percentage.',
    '# Hard Amber Durum Wheat Industrial Milling Standards

## 1. Quality Specifications for Pasta & Semolina
Industrial pasta and biscuit factories in Ethiopia require high-performance Amber Durum Wheat cultivated in Bale, Arsi, and Shewa highlands:
- **Protein Content**: Minimum **13.5% dry basis** (Grade A standard: >= 14.0%). Higher protein ensures non-sticky pasta texture.
- **Wet Gluten Index**: Must exceed **28.0%**, with gluten index above 75% for optimum elasticity.
- **Vitreous Kernel Percentage (Glassiness)**: Minimum **80% vitreous kernels** for Grade 1. Non-vitreous starchy kernels yield inferior flour instead of coarse golden semolina.
- **Falling Number (Hagberg)**: Greater than 250 seconds, indicating absence of premature field sprouting.

## 2. Moisture and Impurities
- **Maximum Moisture**: **12.5%**. Wet grain above 13.5% induces self-heating and elevator silo spoilage.
- **Dockage & Screenings**: Foreign matter, shriveled grains, and broken seeds must remain below 1.5%.

## 3. Recommended Storage
Store in aerated cylindrical steel or concrete silos equipped with thermocouple cable monitoring. Maintain internal aeration cooling when ambient temperatures drop below 18°C.',
    'wheat, durum, semolina, protein, gluten, bale, pasta, milling',
    'National Grain & Feed Millers Association',
    'https://grainstandards.et/wheat/durum',
    4
),
(
    'c0000000-0000-0000-0000-000000000004'::uuid,
    'Certified Warehouse & Silo Management (WDRA & e-NWR Standards)',
    'warehouse-silo-management-wdra',
    'POST_HARVEST_STORAGE',
    'Protocols for electronic Negotiable Warehouse Receipts (e-NWR), pest suppression, hermetic bag storage, and aflatoxin mitigation in grain storage.',
    '# Certified Warehouse & Silo Management Protocol

## 1. Post-Harvest Preservation Standards
Grain loss due to post-harvest weevils, rodents, and fungal molds in East Africa accounts for 15-25% of annual crop volume. Certified WDRA warehouses follow strict protocols:
- **Stacking Architecture**: Sacks must never touch bare ground. Stacks must rest on treated wooden or plastic pallets raised at least 30cm off the concrete floor. Maintain a 50cm buffer between pallet rows and external masonry walls for inspection and airflow.
- **Stack Height Limit**: Stacks should not exceed 15 bags high to avoid bursting seams and compaction at the bottom tier.

## 2. Moisture & Humidity Management
- Keep relative humidity within the warehouse below **65%**.
- Deploy automated digital hygrometers and seed temperature spears. Any temperature rise above 3°C indicates localized pest infestation or micro-biological respiration ("hot spot").

## 3. Fumigation and Insect Control
- Sealed phosphine (Aluminium Phosphide) fumigation under gas-tight gas blankets (minimum 3g phosphine per cubic meter for 5-7 days).
- Aerate warehouse thoroughly for 48 hours prior to human warehouse entry.

## 4. Electronic Negotiable Warehouse Receipts (e-NWR)
Farmers and cooperatives depositing verified grain receive an e-NWR certificate confirming batch tonnage, assay moisture, purity grade, and insurance coverage, which can serve as trade collateral or be transferred directly on the AgriMarketplace.',
    'warehouse, silo, wdra, e-nwr, storage, fumigation, hermetic, moisture',
    'Warehouse Receipt System Regulatory Authority',
    'https://wdra.gov.et/regulations',
    5
),
(
    'c0000000-0000-0000-0000-000000000005'::uuid,
    'Ethiopian Mandi Terminal Price Discovery & Seasonal Supply Dynamics',
    'mandi-price-discovery-dynamics',
    'MARKET_PRICE_TRENDS',
    'Analysis of wholesale price movements across Debre Birhan, Hawassa, Robe/Bale, Kaliti, and Nekemte terminal markets across Meher and Belg harvest seasons.',
    '# Mandi Terminal Price Discovery & Seasonal Price Trends

## 1. Seasonal Cycles
- **Meher Peak Harvest (November - February)**:
  - Highest volume arrivals of Cereals (Teff, Wheat, Maize) and Oilseeds.
  - Farmgate and regional Mandi spot prices usually reach their seasonal low. Commercial buyers, grain mills, and institutional reserves (such as EGTE) typically execute 60-70% of annual procurements during this window.
- **Belg Harvest (March - May)**:
  - Secondary arrival window for short-cycle maize, barley, and early pulses. Provides price stabilization in southern and central regions.
- **Lean Season (July - September)**:
  - Depleted farmgate inventories. Terminal market prices at Kaliti (Addis Ababa) and secondary hubs historically rise by 25-45% compared to December lows.

## 2. Key Regional Mandi Terminals
- **Debre Birhan Mandi**: North Shewa central hub for Magna Teff, highland barley, and faba beans.
- **Robe / Bale Hub**: Primary gateway for Amber Durum Wheat, bread wheat, and barley.
- **Hawassa Logistics Park**: Southern aggregation point for Sidama coffee, haricot beans, and avocado.
- **Kaliti Central Exchange (Addis Ababa)**: Benchmark wholesale terminal determining national clearing prices.

## 3. Freight and Logistics Arbitrage
Inter-regional freight costs typically range between 180 and 350 ETB per quintal depending on diesel tariffs and route security. Bulk aggregation through registered cooperatives reduces transportation overhead by up to 32%.',
    'mandi, price trends, seasonal, meher, belg, debre birhan, hawassa, bale, kaliti',
    'AgriMarketplace Economic Research Desk',
    'https://agrimarketplace.et/market-intel/mandi-rates',
    4
),
(
    'c0000000-0000-0000-0000-000000000006'::uuid,
    'AgriMarketplace Safe Trading, Escrow & Telebirr/CBE Birr Settlement Guide',
    'safe-trading-escrow-settlement',
    'MARKETPLACE_POLICY',
    'Complete guide on procurement cart checkout, verified escrow deposits, inspection release policies, Telebirr / CBE Birr integrations, and dispute resolution.',
    '# AgriMarketplace Safe Trading, Escrow & Payment Settlement Guide

## 1. The 4-Step Procurement Workflow
1. **Order Initiation**: The commercial or retail buyer selects desired commodity lots from verified farmers or cooperatives and submits an order.
2. **Farmer Confirmation**: The farmer receives notification and has 48 hours to confirm inventory lock and schedule logistics/pickup. Upon confirmation, direct contact details are unlocked.
3. **Escrow Guarantee**: Funds are held safely in verified marketplace escrow via Telebirr or CBE Birr commercial settlement gateways. The farmer is guaranteed payment upon fulfillment.
4. **Physical Assay & Delivery Sign-off**:
   - The buyer or their logistics agent inspects the consignment at the designated warehouse or delivery depot.
   - If moisture, grade, and weight match the agreed ECX specifications, the buyer signs off the delivery receipt and the escrow balance is instantly transferred to the farmer.

## 2. Off-Spec Reject & Dispute Protocol
If delivered goods fail declared assay standards (e.g. moisture exceeds 12.5% or purity is lower than listed):
- The buyer flags an official Inspection Dispute within 24 hours of delivery attempt.
- An accredited regional third-party assayer conducts an independent test.
- If verified off-spec, the order is cancelled with a full 100% escrow refund to the buyer.',
    'escrow, settlement, telebirr, cbe birr, dispute, safety, buyer protection',
    'AgriMarketplace Trust & Safety Bureau',
    'https://agrimarketplace.et/trust/escrow-guide',
    4
)
ON CONFLICT (slug) DO NOTHING;
