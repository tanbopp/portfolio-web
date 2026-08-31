"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth", { method: "DELETE" });
        router.push("/auth");
        router.refresh();
      }}
      className="text-neutral-300 transition-colors hover:text-white"
    >
      Logout
    </button>
  );
}
