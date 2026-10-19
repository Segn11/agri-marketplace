-- Migration V4: Seed Demo Users (Admin, Farmer, Buyer) and Initial Ethiopian Commodity Listings
-- Default password for all seeded demo users is: password

-- 1. Insert Demo Users
INSERT INTO users (id, full_name, email, phone, password_hash, role, location, status) VALUES
('a0000000-0000-0000-0000-000000000001', 'System Administrator', 'admin@agri.com', '0911000001', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00GDzPHsekpkS2', 'ROLE_ADMIN', 'Addis Ababa HQ', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000002', 'Gemechu Desta', 'farmer@agri.com', '0911000002', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00GDzPHsekpkS2', 'ROLE_FARMER', 'Debre Birhan, North Shewa', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000003', 'Abebe Commercial Foods', 'buyer@agri.com', '0911000003', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00GDzPHsekpkS2', 'ROLE_BUYER', 'Kality Logistics Park, Addis Ababa', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Farmer Profile
INSERT INTO farmer_profiles (user_id, farm_name, farm_location, description, is_verified) VALUES
('a0000000-0000-0000-0000-000000000002', 'Oda Gida Agricultural Farmers Union', 'Debre Birhan Mandi Terminal, North Shewa', 'Certified primary cooperative union specializing in highland Magna Teff, Durum Wheat, and export pulses.', TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Insert Initial Ethiopian Commodity Listings
-- Retrieve category UUIDs dynamically
INSERT INTO products (
    id, farmer_id, category_id, name, description, unit_price, unit, quantity_available, location, status,
    assay_grade, moisture_content, purity, harvest_season, storage_warehouse, cooperative, badge, version
)
SELECT 
    'b0000000-0000-0000-0000-000000000001'::uuid,
    'a0000000-0000-0000-0000-000000000002'::uuid,
    c.id,
    'Export Grade Pure White Teff (Magna)',
    'Sustainably harvested highland Magna White Teff with immaculate uniform grain texture. Cleaned and processed in certified sorting sheds with certified 99.2% seed purity. Ideal for commercial injera bakeries, millers, and grain distributors.',
    9400.00,
    'Quintal (100kg)',
    150,
    'Debre Birhan Mandi Terminal, North Shewa',
    'ACTIVE',
    'Grade 1 (99.2% Purity)',
    '11.2% (WDRA Standard: < 12.5%)',
    '99.2% Certified Clean',
    'Main Season Harvest (Meher 2026)',
    'Central Grain Warehouse #08, Silo Bay B',
    'Oda Gida Agricultural Farmers Union',
    'Spot e-Auction Lot',
    0
FROM categories c WHERE c.slug = 'cereals-grains'
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, farmer_id, category_id, name, description, unit_price, unit, quantity_available, location, status,
    assay_grade, moisture_content, purity, harvest_season, storage_warehouse, cooperative, badge, version
)
SELECT 
    'b0000000-0000-0000-0000-000000000002'::uuid,
    'a0000000-0000-0000-0000-000000000002'::uuid,
    c.id,
    'Sidama Washed Specialty Green Coffee Beans',
    'High altitude (2,100m) washed specialty green Arabica coffee beans. Features bright floral jasmine aroma, bergamot citrus notes, and refined cane sugar sweetness. Moisture content strictly maintained under 11.5% with ECX Q1 certification.',
    28500.00,
    'Bag (60kg Jute)',
    60,
    'Hawassa Central Dry Port & Export Yard',
    'ACTIVE',
    'Q1 Specialty Grade (SCA 87.5)',
    '10.8% Moisture Meter Assayed',
    'Zero primary defects, hand-sorted',
    'Late Year Wet Mill Processing',
    'Bonded Climate-Controlled Logistics Hub',
    'Sidama Organic Coffee Producers Union',
    'Export Certified',
    0
FROM categories c WHERE c.slug = 'coffee-spices'
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, farmer_id, category_id, name, description, unit_price, unit, quantity_available, location, status,
    assay_grade, moisture_content, purity, harvest_season, storage_warehouse, cooperative, badge, version
)
SELECT 
    'b0000000-0000-0000-0000-000000000003'::uuid,
    'a0000000-0000-0000-0000-000000000002'::uuid,
    c.id,
    'Hard Amber Durum Wheat for Pasta Milling',
    'Premium high-protein Hard Amber Durum Wheat cultivated in the fertile plains of Bale. Rigorously tested for wet gluten index (> 28%) and high vitreous kernel count. Directly packaged in WDRA-certified hermetic bags.',
    6200.00,
    'Quintal (100kg)',
    280,
    'Robe Grain Terminal Hub, Bale Zone',
    'ACTIVE',
    'Grade A (14.2% Protein)',
    '12.0% Moisture Assayed',
    '98.5% Sound Kernel Guarantee',
    'Bale Highland Meher Harvest',
    'Regional Grain Elevator Silo 4',
    'Arsi Bale Flour & Grain Cooperative',
    'High Volume Lot',
    0
FROM categories c WHERE c.slug = 'cereals-grains'
ON CONFLICT (id) DO NOTHING;
