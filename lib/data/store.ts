import { getOptionalSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Product,
  ProductImage,
  SiteSettings,
} from "@/types/database";

type StoreClient = Awaited<ReturnType<typeof createClient>>;
type ProductImageData = Pick<
  ProductImage,
  "id" | "storage_path" | "sort_order" | "alt"
>;
type CategorySummary = Pick<Category, "id" | "name" | "slug">;

export type ProductListItem = Product & {
  images: ProductImageData[];
  category: CategorySummary | null;
};

export type ProductDetail = Product & {
  images: ProductImageData[];
  category: CategorySummary | null;
};

export type ProductSort = "newest" | "price-asc" | "price-desc";
export type AvailabilityFilter = "all" | "available" | "unavailable";

export type ProductQuery = {
  search?: string;
  categorySlug?: string;
  availability?: AvailabilityFilter;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
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

export async function getCategories(): Promise<Category[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Could not load categories:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getProducts(
  query: ProductQuery = {},
): Promise<{ items: ProductListItem[]; total: number }> {
  const supabase = await getClient();
  if (!supabase) return { items: [], total: 0 };

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

  const from = (page - 1) * pageSize;
  const { data, error, count } = await request.range(from, from + pageSize - 1);

  if (error) {
    console.error("Could not load products:", error.message);
    return { items: [], total: 0 };
  }

  return {
    items: await attachRelations(supabase, data ?? []),
    total: count ?? data?.length ?? 0,
  };
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await getClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .neq("status", "draft")
    .maybeSingle();

  if (error) {
    console.error("Could not load product:", error.message);
    return null;
  }
  if (!data) return null;

  const [withRelations] = await attachRelations(supabase, [data]);
  return withRelations ?? null;
}

export async function getRelatedProducts(
  product: ProductDetail,
  limit = 4,
): Promise<ProductListItem[]> {
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
  return fallback.items;
}
