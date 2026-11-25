import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";
import { getOptionalSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

export const dynamic = "force-dynamic";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
const now = new Date();

const staticPages: MetadataRoute.Sitemap = [
  { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
  { url: `${baseUrl}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  { url: `${baseUrl}/request`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  { url: `${baseUrl}/policies/shipping`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  { url: `${baseUrl}/policies/payment`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  { url: `${baseUrl}/policies/refund`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const env = getOptionalSupabaseEnv();
  if (!env) return staticPages;

  const supabase = createClient<Database>(env.url, env.anonKey);
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("status", "available")
    .order("updated_at", { ascending: false });

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
