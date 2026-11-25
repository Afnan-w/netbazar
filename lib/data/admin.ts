import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Category,
  Product,
  ProductImage,
  ProductRequest,
  ProductRequestStatus,
  SiteSettings,
} from "@/types/database";
import { z } from "zod";

const uuidSchema = z.string().uuid();

function isValidId(id: string): boolean {
  return uuidSchema.safeParse(id).success;
}

export type AdminProduct = Product & {
  category: Pick<Category, "name" | "slug"> | null;
  imageCount: number;
};

export type AdminProductDetail = Product & {
  images: ProductImage[];
};

export type RequestStatusCount = {
  status: ProductRequestStatus;
  count: number;
};

export async function getAdminOverview() {
  const supabase = createAdminClient();
  const [productsResult, newRequestsResult, requestsResult] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("product_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("product_requests").select("status"),
  ]);

  const counts = new Map<ProductRequestStatus, number>();
  for (const request of requestsResult.data ?? []) {
    counts.set(request.status, (counts.get(request.status) ?? 0) + 1);
  }

  const statuses: ProductRequestStatus[] = [
    "new",
    "contacted",
    "quoted",
    "paid",
    "shipped",
    "closed",
    "cancelled",
  ];

  return {
    productCount: productsResult.count ?? 0,
    newRequestCount: newRequestsResult.count ?? 0,
    requestsByStatus: statuses.map((status) => ({
      status,
      count: counts.get(status) ?? 0,
    })) satisfies RequestStatusCount[],
  };
}

export async function getAdminProducts(search = ""): Promise<AdminProduct[]> {
  const supabase = createAdminClient();
  let query = supabase.from("products").select("*");
  const term = search.trim().replace(/[,()]/g, " ").slice(0, 100);
  if (term) {
    const pattern = `%${term}%`;
    query = query.or(`name.ilike.${pattern},sku.ilike.${pattern}`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error || !data) {
    console.error("Could not load admin products:", error?.message);
    return [];
  }

  const productIds = data.map((product) => product.id);
  const [categoriesResult, imagesResult] = await Promise.all([
    supabase.from("categories").select("id, name, slug"),
    productIds.length
      ? supabase.from("product_images").select("product_id").in("product_id", productIds)
      : Promise.resolve({ data: [] as { product_id: string }[], error: null }),
  ]);

  const categoryById = new Map(
    (categoriesResult.data ?? []).map((category) => [category.id, category]),
  );
  const imagesByProduct = new Map<string, number>();
  for (const image of imagesResult.data ?? []) {
    imagesByProduct.set(
      image.product_id,
      (imagesByProduct.get(image.product_id) ?? 0) + 1,
    );
  }

  return data.map((product) => ({
    ...product,
    category: product.category_id
      ? (categoryById.get(product.category_id) ?? null)
      : null,
    imageCount: imagesByProduct.get(product.id) ?? 0,
  }));
}

export async function getAdminProduct(id: string): Promise<AdminProductDetail | null> {
  if (!isValidId(id)) return null;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  return { ...data, images: images ?? [] };
}

export async function getAdminCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) {
    console.error("Could not load admin categories:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAdminRequests(
  status: ProductRequestStatus | "all" = "all",
): Promise<ProductRequest[]> {
  const supabase = createAdminClient();
  let query = supabase.from("product_requests").select("*");
  if (status !== "all") query = query.eq("status", status);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    console.error("Could not load requests:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAdminRequest(id: string): Promise<ProductRequest | null> {
  if (!isValidId(id)) return null;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("product_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function getAdminSettings(): Promise<SiteSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return (
    data ?? {
      id: 1,
      whatsapp_number: "8801700000000",
      announcement_text: "",
      contact_email: "",
      facebook_url: "",
      instagram_url: "",
      updated_at: new Date(0).toISOString(),
    }
  );
}
