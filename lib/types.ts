export interface ProjectGallery {
  id: number;
  project_id: number;
  media: string;
  media_type: "image" | "video";
  sort_order: number;
}

export interface ProjectAction {
  label: string;
  url: string;
}

export interface Project {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  work_for: string | null;
  year: string | null;
  deliverables: string[] | null;
  platform: string[] | null;
  technologies: string[] | null;
  actions: ProjectAction[] | null;
  showcase: string | null;
  article: string | null;
  hero_image: string | null;
  card_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  galleries?: ProjectGallery[];
}
