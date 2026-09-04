import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const projects = await getAllProjects();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link href="/admin/projects/new" className="btn btn--primary">
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-neutral-500">Belum ada project.</p>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 px-4 py-3"
            >
              <div>
                <p className="flex items-center gap-2 font-medium">
                  {p.title}
                  <span
                    className={
                      p.project_type === "design"
                        ? "rounded-full border border-neutral-600 px-2 py-0.5 text-[10px] uppercase tracking-wider text-neutral-300"
                        : "rounded-full border border-neutral-800 px-2 py-0.5 text-[10px] uppercase tracking-wider text-neutral-600"
                    }
                  >
                    {p.project_type === "design" ? "Design" : "Software"}
                  </span>
                </p>
                <p className="text-xs text-neutral-500">
                  {p.slug} · {p.published ? "published" : "draft"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/projects/${p.slug}/edit`}
                  className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 transition-colors hover:bg-neutral-800"
                >
                  Edit
                </Link>
                <DeleteButton slug={p.slug} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
