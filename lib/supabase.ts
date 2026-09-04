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
 * Private storage bucket for artwork PDFs. Files here are never served via a
 * public URL — they are only streamed through the /api/artwork/[file] proxy
 * (with anti-download headers) so visitors can view them but not fetch a raw
 * shareable link.
 */
export const ARTWORK_BUCKET = "artwork";

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
