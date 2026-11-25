import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseAdminEnv } from "./env";

/**
 * Server-only client. Never import this from a Client Component: it holds the
 * service role key, which bypasses Row Level Security.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient must only be used on the server.");
  }

  const { url, serviceRoleKey } = getSupabaseAdminEnv();

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
