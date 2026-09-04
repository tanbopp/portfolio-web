import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { STORAGE_BUCKET } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";

const RASTER_IMAGE_EXT = new Set([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "avif",
  "tiff",
  "bmp",
  "gif",
]);

/**
 * Upload endpoint — called ONLY at save time (the admin form stages files in
 * memory until the user clicks Save). Raster images are converted to AVIF
 * (small file, high quality) before being stored.
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

  let ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const raw = Buffer.from(await file.arrayBuffer());
  let bytes: Buffer = raw;
  let contentType = file.type || "application/octet-stream";

  // Convert raster images to AVIF to keep files tiny but high quality.
  if (RASTER_IMAGE_EXT.has(ext)) {
    try {
      bytes = await sharp(raw)
        .resize({ width: 2000, withoutEnlargement: true })
        .avif({ quality: 60 })
        .toBuffer();
      ext = "avif";
      contentType = "image/avif";
    } catch {
      // If conversion fails (e.g. unsupported input), upload the original.
    }
  }

  const path = `${randomUUID()}.${ext}`;
  const { error } = await getSupabaseAdmin()
    .storage.from(STORAGE_BUCKET)
    .upload(path, bytes, { contentType });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
  return NextResponse.json({ url, path });
}
