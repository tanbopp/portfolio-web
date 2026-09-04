import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { ARTWORK_BUCKET } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";

/**
 * Upload an artwork PDF into the private "artwork" bucket.
 * The returned `path` is stored on the project row (artwork_pdf); it is NOT a
 * public URL. Visitors fetch it only through /api/artwork/[file].
 */
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Tidak ada file." }, { status: 400 });
  }
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "File harus berupa PDF." }, { status: 400 });
  }

  const path = `${randomUUID()}.pdf`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error } = await getSupabaseAdmin()
    .storage.from(ARTWORK_BUCKET)
    .upload(path, buf, { contentType: "application/pdf", upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ path });
}
