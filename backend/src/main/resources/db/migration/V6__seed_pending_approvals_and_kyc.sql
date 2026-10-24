-- Migration V6: Seed Pending Approvals (Produce Listings & Farmer KYC) for Admin Moderation
-- Enables immediate real-world testing of administrative quality inspection and KYC verification workflows
-- 0. Update status check constraint on products table to support pending approval
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_status_check;
ALTER TABLE products ADD CONSTRAINT products_status_check 
CHECK (status IN ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'PENDING_APPROVAL', 'REJECTED', 'SUSPENDED'));

INSERT INTO users (id, full_name, email, phone, password_hash, role, location, status) VALUES
('a0000000-0000-0000-0000-000000000004', 'Tirunesh Bekele', 'tirunesh@agri.com', '0911000004', '$2a$10$mx5tQLZIEngHMEVGQwv6Su1SlQVCApbjg3FbKmm2/Go/fh4DZ7RUO', 'ROLE_FARMER', 'Bokoji, Arsi Highlands', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

INSERT INTO farmer_profiles (user_id, farm_name, farm_location, description, is_verified) VALUES
('a0000000-0000-0000-0000-000000000004', 'Arsi Organic Grain Producers Union', 'Bokoji Mandi Terminal, Arsi', 'Producer of highland bread wheat, Kabuli chickpeas, and organic oilseeds. Awaiting platform verification.', FALSE)
ON CONFLICT (user_id) DO NOTHING;

-- 2. Insert Commodity Lots Pending Quality Assay & Administrative Approval
INSERT INTO products (
    id, farmer_id, category_id, name, description, unit_price, unit, quantity_available, location, status,
    assay_grade, moisture_content, purity, harvest_season, storage_warehouse, cooperative, badge, version
)
SELECT 
    'b0000000-0000-0000-0000-000000000005'::uuid,
    'a0000000-0000-0000-0000-000000000002'::uuid,
    c.id,
    'Bako Premium Hybrid White Maize (Lot #402)',
    'High-yield Bako hybrid white maize freshly harvested and sun-cured. Bulk lot stored under sealed aeration in Nekemte Silo #3. Awaiting official ECX quality inspection and market release.',
    5850.00,
    'Quintal (100kg)',
    350,
    'Nekemte Central Mandi, East Wollega',
    'PENDING_APPROVAL',
    'Grade 1 (99.0% Purity)',
    '11.8% Assayed Moisture',
    '99.0% Screened Clean',
    'Meher Harvest 2026',
    'Nekemte Central Silo Bay #03',
    'Oda Gida Agricultural Farmers Union',
    'Pending Assay Approval',
    0
FROM categories c WHERE c.slug = 'cereals-grains'
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, farmer_id, category_id, name, description, unit_price, unit, quantity_available, location, status,
    assay_grade, moisture_content, purity, harvest_season, storage_warehouse, cooperative, badge, version
)
SELECT 
    'b0000000-0000-0000-0000-000000000006'::uuid,
    'a0000000-0000-0000-0000-000000000004'::uuid,
    c.id,
    'Bale Highland Red Haricot Kidney Beans',
    'Export-standard red haricot beans with rich color uniformity, calibrated seed size, and low moisture. Perfect for commercial canning and institutional grain reserves.',
    7400.00,
    'Quintal (100kg)',
    220,
    'Bokoji Mandi Hub, Arsi',
    'PENDING_APPROVAL',
    'Export Grade (98.5% Clean)',
    '10.9% Tested Moisture',
    '98.5% Purity',
    'Meher Harvest 2026',
    'Bokoji Cooperative Storage #01',
    'Arsi Organic Grain Producers Union',
    'Under Inspection',
    0
FROM categories c WHERE c.slug = 'pulses-oilseeds'
ON CONFLICT (id) DO NOTHING;
