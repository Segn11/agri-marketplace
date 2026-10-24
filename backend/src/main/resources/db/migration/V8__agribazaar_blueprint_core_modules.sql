-- Migration V8: AgriBazaar Blueprint Core Modules & 12-Stage Lifecycle
-- Implements Four Pillars: Trade (Auctions/Negotiations), Trust (KYC & AgriPay Escrow Wallet), Fulfilment (Logistics & Weight Slips), Intelligence (Mandi Bhav & Inputs)

-- 1. Extend products with trade type (Auction / Negotiable / Fixed), reserve price & auction scheduling
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS trade_type VARCHAR(30) DEFAULT 'FIXED_PRICE' CHECK (trade_type IN ('FIXED_PRICE', 'AUCTION', 'NEGOTIABLE')),
ADD COLUMN IF NOT EXISTS reserve_price NUMERIC(12, 2),
ADD COLUMN IF NOT EXISTS min_bid_increment NUMERIC(12, 2) DEFAULT 50.00,
ADD COLUMN IF NOT EXISTS current_highest_bid NUMERIC(12, 2),
ADD COLUMN IF NOT EXISTS highest_bidder_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS auction_end_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS pickup_date DATE,
ADD COLUMN IF NOT EXISTS pickup_address VARCHAR(255),
ADD COLUMN IF NOT EXISTS impurity_percentage NUMERIC(5, 2);

-- Update products_status_check to accommodate full AgriBazaar lot lifecycle
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_status_check;
ALTER TABLE products ADD CONSTRAINT products_status_check 
CHECK (status IN ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'PENDING_APPROVAL', 'REJECTED', 'SUSPENDED', 'DRAFT', 'PENDING_REVIEW', 'LIVE', 'BIDDING_NEGOTIATING'));

-- 2. Bids & Counter-Offers Table (For Auctions & Negotiable Trades)
CREATE TABLE IF NOT EXISTS bids_and_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lot_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(30) NOT NULL CHECK (type IN ('AUCTION_BID', 'NEGOTIATION_OFFER', 'SELLER_COUNTER')),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    auto_bid_max NUMERIC(12, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'OUTBID', 'ACCEPTED', 'REJECTED', 'EXPIRED')),
    counter_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bids_lot_id ON bids_and_offers(lot_id);
CREATE INDEX IF NOT EXISTS idx_bids_buyer_id ON bids_and_offers(buyer_id);

-- 3. AgriPay Wallets & Double-Entry Financial Ledger
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    escrow_locked NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (escrow_locked >= 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'ETB',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallet_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    entry_type VARCHAR(20) NOT NULL CHECK (entry_type IN ('DEBIT', 'CREDIT')),
    transaction_type VARCHAR(40) NOT NULL CHECK (transaction_type IN ('DEPOSIT', 'WITHDRAWAL', 'ESCROW_LOCK', 'ESCROW_RELEASE', 'COMMISSION_DEDUCTION', 'DISPUTE_REFUND', 'TRADE_PAYOUT')),
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    balance_after NUMERIC(14, 2) NOT NULL,
    reference_id VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ledger_wallet_id ON wallet_ledger(wallet_id);
CREATE INDEX IF NOT EXISTS idx_ledger_user_id ON wallet_ledger(user_id);

-- 4. Update Orders Lifecycle Status Constraint (12 AgriBazaar Lifecycles)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN (
    'DRAFT', 'PENDING_REVIEW', 'LIVE', 'BIDDING_NEGOTIATING', 'DEAL_CONFIRMED', 
    'PAYMENT_HELD', 'PICKUP_SCHEDULED', 'IN_TRANSIT', 'DELIVERED', 'ACCEPTED', 
    'DISPUTED', 'SETTLED', 'CLOSED', 'PENDING', 'READY', 'COMPLETED', 'REJECTED', 'CANCELLED'
));

-- 5. Fulfilment & Logistics Table (Transporter, Weighing at Source/Destination & Proof of Delivery)
CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    transporter_name VARCHAR(150) NOT NULL,
    driver_name VARCHAR(150),
    driver_phone VARCHAR(30) NOT NULL,
    vehicle_plate_number VARCHAR(50) NOT NULL,
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    source_weight_kg NUMERIC(10, 2) NOT NULL,
    destination_weight_kg NUMERIC(10, 2),
    weight_slip_url VARCHAR(500),
    proof_of_delivery_url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'INSPECTED_ACCEPTED', 'DISPUTED')),
    pickup_time TIMESTAMP WITH TIME ZONE,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);

-- 6. Dispute Resolution Centre
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    raised_by_id UUID NOT NULL REFERENCES users(id),
    claim_type VARCHAR(50) NOT NULL CHECK (claim_type IN ('QUALITY_MISMATCH', 'WEIGHT_SHORTAGE', 'TRANSIT_DAMAGE', 'LATE_DELIVERY', 'WRONG_COMMODITY')),
    description TEXT NOT NULL,
    evidence_notes TEXT,
    claim_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'UNDER_INVESTIGATION', 'RESOLVED_REFUND', 'RESOLVED_PARTIAL', 'DISMISSED')),
    resolution_notes TEXT,
    resolved_by_id UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_disputes_order_id ON disputes(order_id);

-- 7. Mandi Bhav (Real-Time Price Information Across Agricultural Hubs)
CREATE TABLE IF NOT EXISTS mandi_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commodity_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    mandi_market VARCHAR(150) NOT NULL,
    state_region VARCHAR(100) NOT NULL,
    min_price NUMERIC(10, 2) NOT NULL,
    max_price NUMERIC(10, 2) NOT NULL,
    modal_price NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL DEFAULT 'Quintal (100kg)',
    arrival_volume_quintals INTEGER DEFAULT 1200,
    trend VARCHAR(20) DEFAULT 'UP' CHECK (trend IN ('UP', 'DOWN', 'STABLE')),
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_mandi_commodity ON mandi_prices(commodity_name);
CREATE INDEX IF NOT EXISTS idx_mandi_market ON mandi_prices(mandi_market);

-- 8. Input Marketplace (Seeds, Fertilisers, Bio-pesticides & Equipment)
CREATE TABLE IF NOT EXISTS input_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_name VARCHAR(150) NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('SEEDS', 'FERTILISERS', 'PESTICIDES', 'EQUIPMENT')),
    price NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 500,
    description TEXT,
    badge VARCHAR(50),
    is_organic_certified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. KYC Documents Table
CREATE TABLE IF NOT EXISTS kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL CHECK (doc_type IN ('NATIONAL_ID', 'FARM_TITLE', 'TRADE_LICENSE', 'TAX_CERTIFICATE', 'BANK_STATEMENT')),
    doc_number VARCHAR(100) NOT NULL,
    file_url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'VERIFIED', 'REJECTED')),
    rejection_reason TEXT,
    verified_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_kyc_user_id ON kyc_documents(user_id);

-- 10. Seed Initial Realistic AgriBazaar Operational Data

-- Mandi Bhav Prices
INSERT INTO mandi_prices (commodity_name, variety, mandi_market, state_region, min_price, max_price, modal_price, unit, arrival_volume_quintals, trend) VALUES
('White Teff', 'Magna Grade 1', 'Debre Birhan Mandi Terminal', 'North Shewa', 9200.00, 9650.00, 9400.00, 'Quintal (100kg)', 3400, 'UP'),
('Arabica Coffee', 'Sidama Washed Q1', 'Hawassa Central Dry Port', 'Sidama', 27800.00, 29200.00, 28500.00, 'Bag (60kg)', 1850, 'UP'),
('Durum Wheat', 'Hard Amber Grade A', 'Robe Grain Terminal Hub', 'Bale', 6000.00, 6400.00, 6200.00, 'Quintal (100kg)', 5200, 'STABLE'),
('Hybrid Maize', 'Bako BH-540', 'Nekemte Central Mandi', 'East Wollega', 5600.00, 5950.00, 5850.00, 'Quintal (100kg)', 4800, 'DOWN'),
('Red Haricot Beans', 'Export Grade', 'Bokoji Mandi Hub', 'Arsi', 7200.00, 7600.00, 7400.00, 'Quintal (100kg)', 2100, 'UP'),
('Kabuli Chickpeas', 'Grade 1 Machine Clean', 'Gondar Wholesale Mandi', 'Central Gondar', 8100.00, 8500.00, 8300.00, 'Quintal (100kg)', 1600, 'STABLE'),
('White Humera Sesame', 'First Grade Natural', 'Humera Commodity Terminal', 'Tigray / Amhara Border', 14500.00, 15300.00, 14900.00, 'Quintal (100kg)', 950, 'UP');

-- AgriPay Wallets for Users
INSERT INTO wallets (id, user_id, balance, escrow_locked, currency) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 48500.00, 0.00, 'ETB'),     -- Admin Fee Wallet
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 142000.00, 0.00, 'ETB'),    -- Farmer Gemechu
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 385000.00, 94000.00, 'ETB')   -- Buyer Almaz (with funds in escrow)
ON CONFLICT (user_id) DO NOTHING;

-- Initial Wallet Ledger Entries
INSERT INTO wallet_ledger (wallet_id, user_id, entry_type, transaction_type, amount, balance_after, reference_id, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'DEBIT', 'DEPOSIT', 500000.00, 500000.00, 'TXN-BANK-DEP-991', 'Commercial Bank of Ethiopia Direct Top-up'),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'CREDIT', 'ESCROW_LOCK', 94000.00, 406000.00, 'ORD-ESCROW-401', 'Locked in Escrow for Teff Consignment #401'),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'DEBIT', 'TRADE_PAYOUT', 142000.00, 142000.00, 'PAYOUT-781', 'Proceeds released upon delivery acceptance of Durum Wheat Lot');

-- Input Marketplace Products
INSERT INTO input_products (supplier_name, name, category, price, unit, stock_quantity, description, badge, is_organic_certified) VALUES
('Ethio Agri-Inputs Enterprise', 'Certified Bako Hybrid Maize Seed (BH-540)', 'SEEDS', 420.00, '10kg Bag', 450, 'High-yielding drought-tolerant hybrid seed certified by Ethiopian Institute of Agricultural Research (EIAR).', 'EIAR Certified', FALSE),
('Oromia Agricultural Cooperative Federation', 'Granular Urea Nitrogen Fertiliser (46% N)', 'FERTILISERS', 2850.00, '50kg Bag', 1200, 'Premium slow-release agricultural nitrogen fertiliser for vigorous vegetative cereal growth.', 'Subsidized Price', FALSE),
('Arsi Bale Farmers Union', 'Diammonium Phosphate (DAP 18-46-0)', 'FERTILISERS', 3400.00, '50kg Bag', 850, 'High phosphorus root stimulant for early plant development and grain fill.', 'Standard Formula', FALSE),
('Bio-Safe Organic Solutions', 'Bio-Neem Botanical Pesticide (Cold-Pressed)', 'PESTICIDES', 850.00, '1 Litre Bottle', 240, 'Broad-spectrum organic neem extract controlling armyworms, aphids, and foliar beetles.', '100% Organic', TRUE),
('Netafim Horn Agri-Tech', 'Drip Line Micro-Irrigation Field Kit (0.25 Ha)', 'EQUIPMENT', 18500.00, 'Complete Kit', 35, 'Water-saving gravity drip line kit including lateral pipes, drippers, screen filter, and connectors.', 'Water Saver', FALSE);

-- Update Lot #402 to be an active Auction Lot with live bidding
UPDATE products 
SET trade_type = 'AUCTION',
    reserve_price = 5600.00,
    min_bid_increment = 50.00,
    current_highest_bid = 5850.00,
    auction_end_at = CURRENT_TIMESTAMP + INTERVAL '3 days',
    pickup_date = CURRENT_DATE + INTERVAL '5 days',
    pickup_address = 'Nekemte Central Silo Bay #03, East Wollega',
    impurity_percentage = 1.0
WHERE id = 'b0000000-0000-0000-0000-000000000005';

-- Update Lot #401 to be a Negotiable Trade Lot
UPDATE products 
SET trade_type = 'NEGOTIABLE',
    reserve_price = 9000.00,
    min_bid_increment = 100.00,
    pickup_date = CURRENT_DATE + INTERVAL '4 days',
    pickup_address = 'Central Grain Warehouse #08, Debre Birhan',
    impurity_percentage = 0.8
WHERE id = 'b0000000-0000-0000-0000-000000000001';
