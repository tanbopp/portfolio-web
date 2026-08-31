import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Admin client using the service role key (bypasses RLS).
 * Lazily created so the build does not fail when the key is unset;
 * it only throws when actually used at request time.
 * Only used in server-side route handlers — NEVER expose this key to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY env var (server-side only).");
  }
  if (!client) {
    client = createClient(url, serviceRole, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return client;
}
