import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { ARTWORK_BUCKET } from "@/lib/supabase";

/**
 * Anti-download proxy for artwork PDFs.
 *
 * The PDF is stored in a PRIVATE bucket, so there is no public URL to grab.
 * This route streams the bytes with headers that discourage saving/downloading
 * (inline, no-store, nosniff) and deliberately omits Range/Accept-Ranges so the
 * browser's built-in "save" affordances are limited. It is used by the canvas
 * PDF viewer on the public project page.
 *
 * NOTE: any content shown in a browser can technically be captured; "no
 * download" here is a best-effort hardening, not an absolute guarantee.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  // Only allow the uuid-style filenames we generate (defense against path tricks).
  if (!/^[0-9a-fA-F-]{8,}\.pdf$/.test(file)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { data, error } = await getSupabaseAdmin()
    .storage.from(ARTWORK_BUCKET)
    .download(file);

  if (error || !data) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buf = await data.arrayBuffer();

  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
  headers.set("Content-Disposition", 'inline; filename="artwork.pdf"');
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  headers.set("Pragma", "no-cache");
  // Do not advertise range support so partial/save tooling is discouraged.
  headers.delete("Accept-Ranges");

  return new NextResponse(buf, { status: 200, headers });
}
