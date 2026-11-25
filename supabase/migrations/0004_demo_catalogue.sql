-- EXPANDED DEMO CATALOGUE. Run after 0001_initial.sql.
-- Every SKU starts with SAMPLE- and every description says SAMPLE DATA.
-- Safe to re-run: existing SAMPLE- rows are updated, real listings are untouched.
-- Delete these rows before launch.

insert into public.categories (name, slug, sort_order)
values
  ('Phone Accessories', 'phone-accessories', 1),
  ('Home & Kitchen', 'home-and-kitchen', 2),
  ('Fashion', 'fashion', 3),
  ('Electronics', 'electronics', 4),
  ('Toys & Games', 'toys-and-games', 5),
  ('Beauty & Care', 'beauty-and-care', 6),
  ('Outdoor & Travel', 'outdoor-and-travel', 7),
  ('Everyday', 'everyday', 8)
on conflict (slug) do update
set name = excluded.name,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.products (
  sku, name, slug, description, specifications, price_bdt,
  reference_price_bdt, category_id, status, is_featured, is_popular
)
values
  (
    'SAMPLE-PA-001', 'Slim Magnetic Phone Case', 'sample-slim-magnetic-phone-case',
    'SAMPLE DATA — replace with supplier-verified details. Slim everyday case with a soft-touch finish.',
    '{"Material":"TPU + PC","Finish":"Soft touch","Colours":"Black, blue, sand"}'::jsonb,
    420, 590, (select id from public.categories where slug = 'phone-accessories'), 'available', true, true
  ),
  (
    'SAMPLE-PA-002', 'Braided Charging Cable', 'sample-braided-charging-cable',
    'SAMPLE DATA — replace with supplier-verified details. Braided cable for daily charging and travel.',
    '{"Length":"1.5 m","Connector":"USB-C to USB-C","Output":"60 W"}'::jsonb,
    390, null, (select id from public.categories where slug = 'phone-accessories'), 'available', false, true
  ),
  (
    'SAMPLE-PA-003', 'Foldable Phone Stand', 'sample-foldable-phone-stand',
    'SAMPLE DATA — replace with supplier-verified details. Compact stand for video calls and desk use.',
    '{"Material":"Aluminium + ABS","Angles":"Multiple","Folded size":"Pocket friendly"}'::jsonb,
    320, 460, (select id from public.categories where slug = 'phone-accessories'), 'available', false, false
  ),
  (
    'SAMPLE-HK-001', 'Silicone Kitchen Spatula Set', 'sample-silicone-kitchen-spatula-set',
    'SAMPLE DATA — replace with supplier-verified details. Heat-resistant tools for everyday cooking.',
    '{"Pieces":"4","Material":"Food-grade silicone","Heat limit":"230 C"}'::jsonb,
    680, 890, (select id from public.categories where slug = 'home-and-kitchen'), 'available', true, false
  ),
  (
    'SAMPLE-HK-002', 'Foldable Desk Organiser', 'sample-foldable-desk-organiser',
    'SAMPLE DATA — replace with supplier-verified details. Lightweight organiser for cables and small tools.',
    '{"Material":"PP plastic","Compartments":"5","Colour":"Light grey"}'::jsonb,
    890, null, (select id from public.categories where slug = 'home-and-kitchen'), 'available', false, false
  ),
  (
    'SAMPLE-HK-003', 'Reusable Storage Pouches', 'sample-reusable-storage-pouches',
    'SAMPLE DATA — replace with supplier-verified details. Simple pouches for snacks, cables and travel kit.',
    '{"Set":"3 sizes","Closure":"Zip","Material":"Woven fabric"}'::jsonb,
    520, 690, (select id from public.categories where slug = 'home-and-kitchen'), 'available', false, true
  ),
  (
    'SAMPLE-FA-001', 'Lightweight Canvas Tote', 'sample-lightweight-canvas-tote',
    'SAMPLE DATA — replace with supplier-verified details. Simple canvas bag for books and daily essentials.',
    '{"Material":"Cotton canvas","Capacity":"12 L","Strap":"Adjustable"}'::jsonb,
    540, 720, (select id from public.categories where slug = 'fashion'), 'available', false, true
  ),
  (
    'SAMPLE-FA-002', 'Minimalist Woven Belt', 'sample-minimalist-woven-belt',
    'SAMPLE DATA — replace with supplier-verified details. Stretch woven belt with a low-profile buckle.',
    '{"Material":"Elastic weave","Sizes":"S to XL","Buckle":"Matte metal"}'::jsonb,
    620, null, (select id from public.categories where slug = 'fashion'), 'unavailable', false, false
  ),
  (
    'SAMPLE-FA-003', 'Everyday Cotton Cap', 'sample-everyday-cotton-cap',
    'SAMPLE DATA — replace with supplier-verified details. Soft cotton cap with an adjustable back.',
    '{"Material":"Brushed cotton","Fit":"Adjustable","Colours":"Black, olive, beige"}'::jsonb,
    480, 640, (select id from public.categories where slug = 'fashion'), 'available', true, false
  ),
  (
    'SAMPLE-EL-001', 'Portable Mini Speaker', 'sample-portable-mini-speaker',
    'SAMPLE DATA — replace with supplier-verified details. Compact speaker for home, desk and travel.',
    '{"Battery":"1200 mAh","Bluetooth":"5.3","Water resistance":"IPX4"}'::jsonb,
    1450, 1890, (select id from public.categories where slug = 'electronics'), 'available', true, true
  ),
  (
    'SAMPLE-EL-002', 'Wireless Mouse', 'sample-wireless-mouse',
    'SAMPLE DATA — replace with supplier-verified details. Quiet wireless mouse with a compact grip.',
    '{"Connection":"2.4 GHz + Bluetooth","DPI":"Up to 1600","Battery":"AA"}'::jsonb,
    980, null, (select id from public.categories where slug = 'electronics'), 'available', false, false
  ),
  (
    'SAMPLE-EL-003', 'Compact Power Bank', 'sample-compact-power-bank',
    'SAMPLE DATA — replace with supplier-verified details. Slim daily power bank for phones and small devices.',
    '{"Capacity":"10000 mAh","Output":"22.5 W","Ports":"USB-C + USB-A"}'::jsonb,
    1650, 2100, (select id from public.categories where slug = 'electronics'), 'available', true, true
  ),
  (
    'SAMPLE-TG-001', 'Wooden Puzzle Set', 'sample-wooden-puzzle-set',
    'SAMPLE DATA — replace with supplier-verified details. Simple wooden puzzles for quiet play time.',
    '{"Pieces":"3 boards","Material":"Beech wood","Ages":"3+"}'::jsonb,
    750, 990, (select id from public.categories where slug = 'toys-and-games'), 'available', true, true
  ),
  (
    'SAMPLE-TG-002', 'Soft Building Blocks', 'sample-soft-building-blocks',
    'SAMPLE DATA — replace with supplier-verified details. Light blocks that stack easily for small hands.',
    '{"Pieces":"24","Material":"EVA foam","Colours":"Mixed"}'::jsonb,
    890, 1150, (select id from public.categories where slug = 'toys-and-games'), 'available', false, true
  ),
  (
    'SAMPLE-TG-003', 'Desktop Fidget Kit', 'sample-desktop-fidget-kit',
    'SAMPLE DATA — replace with supplier-verified details. Small desk set for short breaks and focus.',
    '{"Pieces":"6","Material":"Silicone + ABS","Use":"Desk"}'::jsonb,
    390, null, (select id from public.categories where slug = 'toys-and-games'), 'available', false, false
  ),
  (
    'SAMPLE-BC-001', 'Travel Grooming Kit', 'sample-travel-grooming-kit',
    'SAMPLE DATA — replace with supplier-verified details. Neat kit for brushes and daily grooming tools.',
    '{"Pieces":"5","Case":"PU leather","Use":"Travel"}'::jsonb,
    720, 950, (select id from public.categories where slug = 'beauty-and-care'), 'available', false, false
  ),
  (
    'SAMPLE-BC-002', 'Reusable Makeup Pads', 'sample-reusable-makeup-pads',
    'SAMPLE DATA — replace with supplier-verified details. Soft reusable pads with a washable pouch.',
    '{"Count":"12","Material":"Microfibre","Care":"Machine washable"}'::jsonb,
    350, 480, (select id from public.categories where slug = 'beauty-and-care'), 'available', false, true
  ),
  (
    'SAMPLE-OT-001', 'Compact Travel Backpack', 'sample-compact-travel-backpack',
    'SAMPLE DATA — replace with supplier-verified details. Light pack for a laptop, bottle and daily layers.',
    '{"Capacity":"18 L","Laptop":"Up to 14 inch","Material":"Water-resistant polyester"}'::jsonb,
    1890, 2450, (select id from public.categories where slug = 'outdoor-and-travel'), 'available', true, true
  ),
  (
    'SAMPLE-OT-002', 'Insulated Water Bottle', 'sample-insulated-water-bottle',
    'SAMPLE DATA — replace with supplier-verified details. Simple bottle that keeps drinks cool or warm.',
    '{"Capacity":"500 ml","Material":"Stainless steel","Finish":"Matte"}'::jsonb,
    690, 890, (select id from public.categories where slug = 'outdoor-and-travel'), 'available', false, true
  ),
  (
    'SAMPLE-EV-001', 'Multi-Purpose Storage Box', 'sample-multi-purpose-storage-box',
    'SAMPLE DATA — replace with supplier-verified details. Stackable box for shelves, drawers and desks.',
    '{"Capacity":"8 L","Material":"PP plastic","Stackable":"Yes"}'::jsonb,
    580, 760, (select id from public.categories where slug = 'everyday'), 'available', false, false
  ),
  (
    'SAMPLE-EV-002', 'Cable Management Clip Set', 'sample-cable-management-clip-set',
    'SAMPLE DATA — replace with supplier-verified details. Small clips to tidy desk and bedside cables.',
    '{"Count":"8","Material":"Silicone","Colours":"Grey, mint"}'::jsonb,
    240, 340, (select id from public.categories where slug = 'everyday'), 'available', false, true
  )
on conflict (sku) do update
set name = excluded.name,
    slug = excluded.slug,
    description = excluded.description,
    specifications = excluded.specifications,
    price_bdt = excluded.price_bdt,
    reference_price_bdt = excluded.reference_price_bdt,
    category_id = excluded.category_id,
    status = excluded.status,
    is_featured = excluded.is_featured,
    is_popular = excluded.is_popular,
    updated_at = now();
