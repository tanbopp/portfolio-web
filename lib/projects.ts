import { supabase } from "./supabase";
import type { Project, ProjectGallery } from "./types";

const SELECT =
  "id,title,description,slug,work_for,year,deliverables,platform,technologies,actions,showcase,article,hero_image,card_image,published,created_at,updated_at";

/** Normalize a value that may be an array, a JSON-encoded string, or null. */
function parseList(value: unknown): string[] | null {
  if (value == null) return null;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // not JSON — fall through
    }
    return [value];
  }
  return null;
}

function mapRow(row: any): Project {
  return {
    ...row,
    deliverables: parseList(row.deliverables),
    platform: parseList(row.platform),
    technologies: parseList(row.technologies),
    actions: row.actions ?? null,
    published: !!row.published,
  };
}

/** Published projects for the public home page, newest year first. */
export async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(SELECT)
    .eq("published", true)
    .order("year", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

/** A single published project by slug, with its gallery. */
export async function getProjectBySlug(
  slug: string,
): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const project = mapRow(data);

  const { data: galleries, error: gErr } = await supabase
    .from("project_galleries")
    .select("id,project_id,media,media_type,sort_order")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true });

  if (!gErr) {
    project.galleries = (galleries ?? []) as ProjectGallery[];
  }

  return project;
}

/** All projects (admin). */
export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(SELECT)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
