import { getOptionalSupabaseEnv } from "@/lib/supabase/env";

export function getProductImageUrl(storagePath: string): string {
  const base = getOptionalSupabaseEnv()?.url;
  if (!base) return "";

  const encodedPath = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${base.replace(/\/$/, "")}/storage/v1/object/public/product-images/${encodedPath}`;
}
