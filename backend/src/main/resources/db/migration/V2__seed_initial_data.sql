-- Initial Seed Data: Agricultural Categories
INSERT INTO categories (name, slug, description) VALUES
('Cereals & Grains', 'cereals-grains', 'Teff, wheat, barley, maize, sorghum and other staples'),
('Vegetables', 'vegetables', 'Onions, tomatoes, potatoes, cabbage, peppers and fresh greens'),
('Fruits', 'fruits', 'Mangoes, bananas, avocados, oranges and seasonal fruits'),
('Pulses & Oilseeds', 'pulses-oilseeds', 'Beans, lentils, chickpeas, peas, and sesame'),
('Coffee & Spices', 'coffee-spices', 'Premium Ethiopian highland coffee, ginger, korarima, garlic'),
('Dairy & Poultry', 'dairy-poultry', 'Fresh milk, butter, cheese, eggs, and poultry products'),
('Livestock & Animal Feeds', 'livestock-feeds', 'Cattle, sheep, goats, honey, and hay/feed supplements')
ON CONFLICT (name) DO NOTHING;
