import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Tidak ada file." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `${randomUUID()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buf, { contentType: file.type || "application/octet-stream" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
  return NextResponse.json({ url, path });
}
