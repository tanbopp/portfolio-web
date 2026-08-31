import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.",
  );
}

/** Storage bucket used for project media. */
export const STORAGE_BUCKET = "projects";

/**
 * Resolve a stored media path to a public URL.
 * - Absolute URLs are returned as-is.
 * - DB paths look like "projects/<folder>/<file>" (Laravel legacy format);
 *   we map them onto the Supabase Storage bucket.
 */
export function storageUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.replace(/^projects\//, "");
  return `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${clean}`;
}

/** Create a client for server components / route handlers. */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
