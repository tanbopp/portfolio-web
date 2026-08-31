import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectBySlug } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit: {project.title}</h1>
      <ProjectForm initial={project} isEdit />
    </div>
  );
}
