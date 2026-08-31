"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter();

  async function onDelete() {
    if (!confirm("Hapus project ini?")) return;
    const res = await fetch(`/api/projects/${slug}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Gagal menghapus project.");
  }

  return (
    <button
      onClick={onDelete}
      className="rounded border border-red-900/60 px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-950/40"
    >
      Delete
    </button>
  );
}
