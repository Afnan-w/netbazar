/**
 * Supports both manually added variables and the names synced by the
 * official Vercel → Supabase integration.
 */
function publicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY;

  return url && anonKey ? { url, anonKey } : null;
}

export function getOptionalSupabaseEnv() {
  return publicEnv();
}

export function getSupabaseEnv() {
  const env = publicEnv();
  if (!env) {
    throw new Error(
      "Missing Supabase URL or publishable key. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or connect the Vercel Supabase integration.",
    );
  }
  return env;
}

export function getSupabaseAdminEnv() {
  const { url } = getSupabaseEnv();
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "Missing server-only Supabase secret key. Add SUPABASE_SERVICE_ROLE_KEY (or connect the Vercel Supabase integration).",
    );
  }

  return { url, serviceRoleKey };
}
