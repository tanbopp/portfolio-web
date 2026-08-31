import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Buat Project Baru</h1>
      <ProjectForm isEdit={false} />
    </div>
  );
}
