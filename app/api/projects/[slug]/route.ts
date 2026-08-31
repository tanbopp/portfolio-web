import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAdmin } from "@/lib/auth";

function cleanSlug(slug: string, title: string): string {
  const s = (slug || "").trim();
  if (s) return s.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

  const { data, error } = await supabaseAdmin
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
      published: !!body.published,
    })
    .eq("slug", oldSlug)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
  const { error } = await supabaseAdmin.from("projects").delete().eq("slug", slug);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
