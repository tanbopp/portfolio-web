import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isAdmin } from "@/lib/auth";
import { STORAGE_BUCKET, ARTWORK_BUCKET } from "@/lib/supabase";

function cleanSlug(slug: string, title: string): string {
  const s = (slug || "").trim();
  if (s) return s.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Best-effort removal of stored objects that are no longer referenced. */
async function removeMedia(paths: (string | null | undefined)[], bucket: string) {
  const names = paths
    .filter((p): p is string => !!p && !p.startsWith("blob:") && !p.startsWith("http"))
    .map((n) => n.replace(/^projects\//, "").replace(/^artwork\//, ""));
  if (!names.length) return;
  try {
    await getSupabaseAdmin().storage.from(bucket).remove(names);
  } catch {
    // best-effort cleanup — ignore failures
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug: oldSlug } = await params;
  const body = await req.json().catch(() => null);
  if (!body || !body.title) {
    return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });
  }

  const slug = cleanSlug(body.slug, body.title);
  const platform = Array.isArray(body.platform)
    ? JSON.stringify(body.platform)
    : null;

  const admin = getSupabaseAdmin();

  // Capture the previously stored media so we can delete anything removed.
  const { data: oldRow } = await admin
    .from("projects")
    .select("id,hero_image,card_image,artwork_pdf")
    .eq("slug", oldSlug)
    .maybeSingle();

  let oldGalleryMedia: string[] = [];
  if (oldRow?.id) {
    const { data: og } = await admin
      .from("project_galleries")
      .select("media")
      .eq("project_id", oldRow.id);
    oldGalleryMedia = (og ?? []).map((r) => r.media);
  }

  const { data, error } = await admin
    .from("projects")
    .update({
      title: body.title,
      description: body.description ?? null,
      slug,
      work_for: body.work_for ?? null,
      year: body.year ?? null,
      deliverables: Array.isArray(body.deliverables) ? body.deliverables : null,
      platform,
      technologies: Array.isArray(body.technologies) ? body.technologies : null,
      actions: Array.isArray(body.actions) ? body.actions : null,
      showcase: body.showcase ?? null,
      article: body.article ?? null,
      hero_image: body.hero_image ?? null,
      card_image: body.card_image ?? null,
      project_type: body.project_type === "design" ? "design" : "software",
      pacdora_url: body.pacdora_url ?? null,
      artwork_pdf: body.artwork_pdf ?? null,
      published: !!body.published,
    })
    .eq("slug", oldSlug)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Replace gallery rows
  if (data) {
    await admin.from("project_galleries").delete().eq("project_id", data.id);
    if (Array.isArray(body.gallery) && body.gallery.length) {
      const rows = body.gallery.map((media: string, i: number) => ({
        project_id: data.id,
        media,
        media_type: "image",
        sort_order: i,
      }));
      await admin.from("project_galleries").insert(rows);
    }
  }

  // Delete storage objects that are no longer referenced by this project.
  const newMedia = [
    body.hero_image,
    body.card_image,
    ...(Array.isArray(body.gallery) ? body.gallery : []),
  ];
  const removedMedia = [
    oldRow?.hero_image,
    oldRow?.card_image,
    ...oldGalleryMedia,
  ].filter((m) => m && !newMedia.includes(m));
  await removeMedia(removedMedia, STORAGE_BUCKET);

  if (oldRow?.artwork_pdf && oldRow.artwork_pdf !== body.artwork_pdf) {
    await removeMedia([oldRow.artwork_pdf], ARTWORK_BUCKET);
  }

  return NextResponse.json({ project: data });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const admin = getSupabaseAdmin();

  // Remove associated storage before deleting the row.
  const { data: row } = await admin
    .from("projects")
    .select("id,hero_image,card_image,artwork_pdf")
    .eq("slug", slug)
    .maybeSingle();

  if (row?.id) {
    const { data: g } = await admin
      .from("project_galleries")
      .select("media")
      .eq("project_id", row.id);
    const galleryMedia = (g ?? []).map((r) => r.media);
    await removeMedia([row.hero_image, row.card_image, ...galleryMedia], STORAGE_BUCKET);
    if (row.artwork_pdf) await removeMedia([row.artwork_pdf], ARTWORK_BUCKET);
  }

  const { error } = await admin.from("projects").delete().eq("slug", slug);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
