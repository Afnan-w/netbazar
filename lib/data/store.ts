import { getOptionalSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Product,
  ProductImage,
  SiteSettings,
} from "@/types/database";
import { demoCategories, demoProducts, getDemoProductBySlug, getDemoRelated } from "./demo-catalogue";
import { marketplaceFor, shippingDaysValue } from "@/lib/utils/marketplace";

type StoreClient = Awaited<ReturnType<typeof createClient>>;
type ProductImageData = Pick<
  ProductImage,
  "id" | "storage_path" | "sort_order" | "alt"
>;
type CategorySummary = Pick<Category, "id" | "name" | "slug">;

export type ProductBadge = "New" | "Hot" | "Best seller" | "Limited";

export type ProductMarketplace = {
  badge?: ProductBadge;
  rating?: number;
  soldCount?: number;
  shippingDays?: string;
};

export type ProductListItem = Product & {
  images: ProductImageData[];
  category: CategorySummary | null;
  marketplace?: ProductMarketplace;
};

export type ProductDetail = Product & {
  images: ProductImageData[];
  category: CategorySummary | null;
  marketplace?: ProductMarketplace;
};

export type ProductSort = "newest" | "price-asc" | "price-desc";
export type AvailabilityFilter = "all" | "available" | "unavailable";
export type ShippingFilter = "all" | "fast" | "standard";

export type ProductQuery = {
  search?: string;
  categorySlug?: string;
  availability?: AvailabilityFilter;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
  offset?: number;
  minPrice?: number;
  maxPrice?: number;
  shippingTime?: ShippingFilter;
  featured?: boolean;
  popular?: boolean;
  excludeProductId?: string;
};

const fallbackSettings: SiteSettings = {
  id: 1,
  whatsapp_number: "8801627293330",
  announcement_text:
    "Payment is upfront. We confirm the final price, shipping and delivery time on WhatsApp before you pay.",
  contact_email: "hello@netbazar.example",
  facebook_url: "",
  instagram_url: "",
  updated_at: new Date(0).toISOString(),
};

async function getClient(): Promise<StoreClient | null> {
  // A build without environment variables should still produce a usable shell.
  if (!getOptionalSupabaseEnv()) {
    return null;
  }

  try {
    return await createClient();
  } catch (error) {
    // During prerender Next.js raises this for cookie access; the route becomes
    // dynamic automatically, so it is not a real failure.
    const isDynamicUsage =
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("DYNAMIC_SERVER_USAGE");
    if (!isDynamicUsage) {
      console.error("Could not create the Supabase client:", error);
    }
    return null;
  }
}

function cleanSearch(value: string): string {
  return value.replace(/[,()]/g, " ").trim().slice(0, 100);
}

async function attachRelations(
  supabase: StoreClient,
  products: Product[],
): Promise<ProductListItem[]> {
  if (products.length === 0) return [];

  const productIds = products.map((product) => product.id);
  const categoryIds = [
    ...new Set(
      products
        .map((product) => product.category_id)
        .filter((id): id is string => id !== null),
    ),
  ];

  const [imagesResult, categoriesResult] = await Promise.all([
    supabase
      .from("product_images")
      .select("id, product_id, storage_path, sort_order, alt")
      .in("product_id", productIds)
      .order("sort_order", { ascending: true }),
    categoryIds.length
      ? supabase
          .from("categories")
          .select("id, name, slug")
          .in("id", categoryIds)
      : Promise.resolve({ data: [] as CategorySummary[], error: null }),
  ]);

  if (imagesResult.error) {
    console.error("Could not load product images:", imagesResult.error.message);
  }
  if (categoriesResult.error) {
    console.error("Could not load categories:", categoriesResult.error.message);
  }

  const imagesByProduct = new Map<string, ProductImageData[]>();
  for (const image of imagesResult.data ?? []) {
    const existing = imagesByProduct.get(image.product_id) ?? [];
    existing.push({
      id: image.id,
      storage_path: image.storage_path,
      sort_order: image.sort_order,
      alt: image.alt,
    });
    imagesByProduct.set(image.product_id, existing);
  }

  const categoryById = new Map<string, CategorySummary>();
  for (const category of categoriesResult.data ?? []) {
    categoryById.set(category.id, category);
  }

  return products.map((product) => ({
    ...product,
    images: imagesByProduct.get(product.id) ?? [],
    marketplace: marketplaceFor(product),
    category: product.category_id
      ? (categoryById.get(product.category_id) ?? null)
      : null,
  }));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await getClient();
  if (!supabase) return fallbackSettings;

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Could not load site settings:", error.message);
    return fallbackSettings;
  }

  return data ?? fallbackSettings;
}

function filterDemo(query: ProductQuery = {}): { items: ProductListItem[]; total: number } {
  let items = [...demoProducts];
  if (query.categorySlug) items = items.filter((p) => p.category?.slug === query.categorySlug);
  if (query.search) {
    const q = query.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }
  if (query.availability === "available") items = items.filter((p) => p.status === "available");
  else if (query.availability === "unavailable") items = items.filter((p) => p.status === "unavailable");
  if (query.featured) items = items.filter((p) => p.is_featured);
  if (query.popular) items = items.filter((p) => p.is_popular);
  if (query.excludeProductId) items = items.filter((p) => p.id !== query.excludeProductId);
  if (query.minPrice !== undefined) items = items.filter((p) => p.price_bdt >= query.minPrice!);
  if (query.maxPrice !== undefined) items = items.filter((p) => p.price_bdt <= query.maxPrice!);
  if (query.shippingTime === "fast") {
    items = items.filter((p) => shippingDaysValue(p.marketplace?.shippingDays) <= 7);
  } else if (query.shippingTime === "standard") {
    items = items.filter((p) => shippingDaysValue(p.marketplace?.shippingDays) <= 12);
  }
  if (query.sort === "price-asc") items.sort((a, b) => a.price_bdt - b.price_bdt);
  else if (query.sort === "price-desc") items.sort((a, b) => b.price_bdt - a.price_bdt);
  const total = items.length;
  const page = Math.max(1, Math.floor(query.page ?? 1));
  const pageSize = Math.max(1, Math.min(48, Math.floor(query.pageSize ?? 12)));
  const from = (page - 1) * pageSize + Math.max(0, Math.floor(query.offset ?? 0));
  return { items: items.slice(from, from + pageSize), total };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await getClient();
  if (!supabase) return demoCategories;

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data?.length) {
    if (error) console.error("Could not load categories:", error.message);
    return demoCategories;
  }

  return data;
}

export async function getProducts(
  query: ProductQuery = {},
): Promise<{ items: ProductListItem[]; total: number }> {
  const supabase = await getClient();
  if (!supabase) return filterDemo(query);

  const page = Math.max(1, Math.floor(query.page ?? 1));
  const pageSize = Math.max(1, Math.min(48, Math.floor(query.pageSize ?? 12)));
  let request = supabase.from("products").select("*", { count: "exact" });

  if (query.categorySlug) {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", query.categorySlug)
      .maybeSingle();

    if (categoryError) {
      console.error("Could not resolve category:", categoryError.message);
    }
    if (!category) return { items: [], total: 0 };
    request = request.eq("category_id", category.id);
  }

  const search = query.search ? cleanSearch(query.search) : "";
  if (search) {
    const pattern = `%${search}%`;
    request = request.or(
      `name.ilike.${pattern},sku.ilike.${pattern},description.ilike.${pattern}`,
    );
  }

  if (query.availability === "available") {
    request = request.eq("status", "available");
  } else if (query.availability === "unavailable") {
    request = request.eq("status", "unavailable");
  } else {
    request = request.neq("status", "draft");
  }

  if (query.minPrice !== undefined) request = request.gte("price_bdt", query.minPrice);
  if (query.maxPrice !== undefined) request = request.lte("price_bdt", query.maxPrice);
  if (query.featured) request = request.eq("is_featured", true);
  if (query.popular) request = request.eq("is_popular", true);
  if (query.excludeProductId) {
    request = request.neq("id", query.excludeProductId);
  }

  if (query.sort === "price-asc") {
    request = request.order("price_bdt", { ascending: true });
  } else if (query.sort === "price-desc") {
    request = request.order("price_bdt", { ascending: false });
  } else {
    request = request.order("created_at", { ascending: false });
  }

  const from = (page - 1) * pageSize + Math.max(0, Math.floor(query.offset ?? 0));
  const { data, error, count } = await request.range(from, from + pageSize - 1);

  if (error) {
    console.error("Could not load products:", error.message);
    return filterDemo(query);
  }

  let items = await attachRelations(supabase, data ?? []);
  const onlySamples = items.length > 0 && items.every((p) => p.sku.startsWith("SAMPLE-"));
  if ((items.length === 0 && (count ?? 0) === 0) || onlySamples) return filterDemo(query);

  if (query.shippingTime === "fast") {
    items = items.filter((p) => shippingDaysValue(p.marketplace?.shippingDays) <= 7);
    return { items, total: items.length };
  }
  if (query.shippingTime === "standard") {
    items = items.filter((p) => shippingDaysValue(p.marketplace?.shippingDays) <= 12);
    return { items, total: items.length };
  }

  return { items, total: count ?? items.length };
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await getClient();
  if (!supabase) return getDemoProductBySlug(slug);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .neq("status", "draft")
    .maybeSingle();

  if (error) {
    console.error("Could not load product:", error.message);
    return getDemoProductBySlug(slug);
  }
  if (!data) return getDemoProductBySlug(slug);

  const [withRelations] = await attachRelations(supabase, [data]);
  if (withRelations?.sku.startsWith("SAMPLE-")) return getDemoProductBySlug(slug) ?? withRelations;
  return withRelations ?? null;
}

export async function getRelatedProducts(
  product: ProductDetail,
  limit = 4,
): Promise<ProductListItem[]> {
  if (product.sku.startsWith("DEMO-")) return getDemoRelated(product, limit);
  if (!product.category) {
    const { items } = await getProducts({
      availability: "available",
      excludeProductId: product.id,
      pageSize: limit,
    });
    return items;
  }

  const { items } = await getProducts({
    categorySlug: product.category.slug,
    availability: "available",
    excludeProductId: product.id,
    pageSize: limit,
    sort: "newest",
  });

  if (items.length > 0) return items;

  const fallback = await getProducts({
    availability: "available",
    excludeProductId: product.id,
    pageSize: limit,
  });
  return fallback.items.length > 0 ? fallback.items : getDemoRelated(product, limit);
}
