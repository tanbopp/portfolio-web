import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !serviceRole) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY env var (server-side only).");
}

/**
 * Admin client using the service role key (bypasses RLS).
 * Only used in server-side route handlers for writes/uploads.
 * NEVER expose this key to the browser.
 */
export const supabaseAdmin = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
});
