import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-neutral-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-semibold tracking-tight">
            Tanbopp <span className="text-neutral-500">Admin</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="text-neutral-300 transition-colors hover:text-white">
              Dashboard
            </Link>
            <Link href="/admin/projects/new" className="text-neutral-300 transition-colors hover:text-white">
              New Project
            </Link>
            <Link href="/" target="_blank" className="text-neutral-300 transition-colors hover:text-white">
              View Site
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
