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
 * Storage bucket for artwork PDFs. Original design kept it private and streamed
 * through /api/artwork/[file] so visitors couldn't grab a raw link; if you make
 * the bucket public, the artwork URL below becomes directly loadable.
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

/**
 * Resolve a stored artwork PDF to a public object URL.
 * Accepts a full URL, a "artwork/<file>" or "projects/<file>" path, or a bare
 * filename (which we look up in the artwork bucket).
 */
export function artworkUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("projects/")) return storageUrl(path);
  const clean = path.replace(/^artwork\//, "");
  return `${supabaseUrl}/storage/v1/object/public/${ARTWORK_BUCKET}/${clean}`;
}

/** Create a client for server components / route handlers. */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
