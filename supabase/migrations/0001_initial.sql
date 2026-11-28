-- Netbazar initial schema, RLS policies, storage bucket and policies.
-- Run this file in the Supabase SQL Editor before 0002_sample_data.sql.

create type public.product_status as enum ('available', 'unavailable', 'draft');
create type public.product_request_status as enum (
  'new',
  'contacted',
  'quoted',
  'paid',
  'shipped',
  'closed',
  'cancelled'
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique check (char_length(trim(sku)) > 0),
  name text not null check (char_length(trim(name)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  specifications jsonb not null default '{}'::jsonb,
  price_bdt numeric(12, 2) not null check (price_bdt >= 0),
  reference_price_bdt numeric(12, 2) check (reference_price_bdt > 0),
  category_id uuid references public.categories (id) on delete set null,
  status public.product_status not null default 'draft',
  is_featured boolean not null default false,
  is_popular boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null unique check (char_length(trim(storage_path)) > 0),
  sort_order integer not null default 0,
  alt text not null default '',
  created_at timestamptz not null default now()
);

create table public.product_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  phone text not null check (char_length(trim(phone)) > 0),
  address text not null check (char_length(trim(address)) > 0),
  description text not null check (char_length(trim(description)) > 0),
  product_link text,
  quantity integer not null default 1 check (quantity > 0),
  budget_bdt numeric(12, 2) check (budget_bdt >= 0),
  status public.product_request_status not null default 'new',
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id integer primary key default 1 check (id = 1),
  whatsapp_number text not null default '',
  announcement_text text not null default '',
  contact_email text not null default '',
  facebook_url text not null default '',
  instagram_url text not null default '',
  updated_at timestamptz not null default now()
);

-- Admin identities. We use an admins table (not a JWT claim) so access can be
-- granted or revoked immediately without asking users to sign in again.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

insert into public.site_settings (id, whatsapp_number, announcement_text, contact_email)
values (
  1,
  '8801627293330',
  'Supplier checked first. We send the price, shipping and delivery time in your quote before you pay.',
  'ox17afnan@gmail.com'
);

create index products_status_created_at_idx on public.products (status, created_at desc);
create index products_category_id_idx on public.products (category_id);
create index products_featured_idx on public.products (is_featured) where is_featured;
create index products_popular_idx on public.products (is_popular) where is_popular;
create index product_images_product_id_sort_order_idx
  on public.product_images (product_id, sort_order);
create index product_requests_status_created_at_idx
  on public.product_requests (status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();
create trigger product_requests_set_updated_at
  before update on public.product_requests
  for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- SECURITY DEFINER lets every RLS policy ask one simple question without
-- recursively applying the admins table policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admins as a
    where a.user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated, service_role;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_requests enable row level security;
alter table public.site_settings enable row level security;
alter table public.admins enable row level security;

revoke all on table public.categories, public.products, public.product_images,
  public.product_requests, public.site_settings, public.admins from anon, authenticated;

grant select on public.categories, public.products, public.product_images,
  public.site_settings to anon, authenticated;
grant insert, update, delete on public.categories, public.products,
  public.product_images, public.site_settings to authenticated;
grant insert on public.product_requests to anon, authenticated;
grant select, update, delete on public.product_requests to authenticated;

create policy "Anyone can read categories"
  on public.categories for select to anon, authenticated using (true);
create policy "Admins can insert categories"
  on public.categories for insert to authenticated with check (public.is_admin());
create policy "Admins can update categories"
  on public.categories for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete categories"
  on public.categories for delete to authenticated using (public.is_admin());

create policy "Anyone can read non-draft products"
  on public.products for select to anon, authenticated
  using (status <> 'draft' or public.is_admin());
create policy "Admins can insert products"
  on public.products for insert to authenticated with check (public.is_admin());
create policy "Admins can update products"
  on public.products for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete products"
  on public.products for delete to authenticated using (public.is_admin());

create policy "Anyone can read images of visible products"
  on public.product_images for select to anon, authenticated
  using (
    exists (
      select 1 from public.products as p
      where p.id = product_id and (p.status <> 'draft' or public.is_admin())
    )
  );
create policy "Admins can insert product images"
  on public.product_images for insert to authenticated with check (public.is_admin());
create policy "Admins can update product images"
  on public.product_images for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete product images"
  on public.product_images for delete to authenticated using (public.is_admin());

create policy "Anyone can submit a product request"
  on public.product_requests for insert to anon, authenticated with check (true);
create policy "Admins can read product requests"
  on public.product_requests for select to authenticated using (public.is_admin());
create policy "Admins can update product requests"
  on public.product_requests for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete product requests"
  on public.product_requests for delete to authenticated using (public.is_admin());

create policy "Anyone can read site settings"
  on public.site_settings for select to anon, authenticated using (true);
create policy "Admins can update site settings"
  on public.site_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Public bucket for product photos. Uploads/downloads through the Storage API
-- are still controlled by the policies below.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Anyone can view product images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');
create policy "Admins can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());
create policy "Admins can replace product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());
create policy "Admins can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
