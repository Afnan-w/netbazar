-- SAMPLE DATA ONLY. Every SKU starts with SAMPLE- and every description says so.
-- Replace or delete these rows before going live. Run after 0001_initial.sql.

insert into public.categories (name, slug, sort_order)
values
  ('Phone Accessories', 'phone-accessories', 1),
  ('Home & Kitchen', 'home-and-kitchen', 2),
  ('Fashion', 'fashion', 3),
  ('Electronics', 'electronics', 4)
on conflict (slug) do nothing;

insert into public.products (
  sku, name, slug, description, specifications, price_bdt,
  reference_price_bdt, category_id, status, is_featured, is_popular
)
values
  (
    'SAMPLE-PA-001',
    'Magnetic Phone Case',
    'sample-magnetic-phone-case',
    'SAMPLE DATA — replace with supplier-verified details. Slim magnetic case with a soft-touch finish.',
    '{"Material":"TPU + PC","Compatibility":"Most wireless-charging phones","Colours":"Black, blue, beige"}'::jsonb,
    450, 650, (select id from public.categories where slug = 'phone-accessories'),
    'available', true, true
  ),
  (
    'SAMPLE-PA-002',
    'Braided Charging Cable',
    'sample-braided-charging-cable',
    'SAMPLE DATA — replace with supplier-verified details. Durable braided cable for everyday charging.',
    '{"Length":"1.5 m","Connector":"USB-C to USB-C","Output":"60 W"}'::jsonb,
    390, null, (select id from public.categories where slug = 'phone-accessories'),
    'available', false, true
  ),
  (
    'SAMPLE-HK-001',
    'Silicone Kitchen Spatula Set',
    'sample-silicone-kitchen-spatula-set',
    'SAMPLE DATA — replace with supplier-verified details. Heat-resistant silicone tools for daily cooking.',
    '{"Pieces":"4","Material":"Food-grade silicone","Heat limit":"230 C"}'::jsonb,
    680, 890, (select id from public.categories where slug = 'home-and-kitchen'),
    'available', true, false
  ),
  (
    'SAMPLE-HK-002',
    'Foldable Desk Organiser',
    'sample-foldable-desk-organiser',
    'SAMPLE DATA — replace with supplier-verified details. Lightweight organiser for cables and small tools.',
    '{"Material":"PP plastic","Compartments":"5","Colour":"Light grey"}'::jsonb,
    890, null, (select id from public.categories where slug = 'home-and-kitchen'),
    'available', false, false
  ),
  (
    'SAMPLE-FA-001',
    'Lightweight Canvas Tote',
    'sample-lightweight-canvas-tote',
    'SAMPLE DATA — replace with supplier-verified details. Simple canvas bag for books and daily essentials.',
    '{"Material":"Cotton canvas","Capacity":"12 L","Strap":"Adjustable"}'::jsonb,
    540, 720, (select id from public.categories where slug = 'fashion'),
    'available', false, true
  ),
  (
    'SAMPLE-FA-002',
    'Minimalist Woven Belt',
    'sample-minimalist-woven-belt',
    'SAMPLE DATA — replace with supplier-verified details. Stretch woven belt with a low-profile buckle.',
    '{"Material":"Elastic weave","Sizes":"S to XL","Buckle":"Matte metal"}'::jsonb,
    620, null, (select id from public.categories where slug = 'fashion'),
    'unavailable', false, false
  ),
  (
    'SAMPLE-EL-001',
    'Portable Mini Speaker',
    'sample-portable-mini-speaker',
    'SAMPLE DATA — replace with supplier-verified details. Compact Bluetooth speaker for home and travel.',
    '{"Battery":"1200 mAh","Bluetooth":"5.3","Water resistance":"IPX4"}'::jsonb,
    1450, 1890, (select id from public.categories where slug = 'electronics'),
    'available', true, true
  ),
  (
    'SAMPLE-EL-002',
    'Wireless Mouse',
    'sample-wireless-mouse',
    'SAMPLE DATA — replace with supplier-verified details. Quiet wireless mouse with a compact grip.',
    '{"Connection":"2.4 GHz + Bluetooth","DPI":"Up to 1600","Battery":"AA"}'::jsonb,
    980, null, (select id from public.categories where slug = 'electronics'),
    'available', false, false
  )
on conflict (sku) do nothing;
