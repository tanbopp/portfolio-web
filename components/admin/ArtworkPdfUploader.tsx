"use client";

import { useRef, useState } from "react";
import MaterialIcon from "@/components/MaterialIcon";

/**
 * Upload a PDF into the private artwork bucket (see /api/artwork).
 * Only stores the private `path` — never a public URL.
 */
export default function ArtworkPdfUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (path: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/artwork", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");
      onChange(data.path);
    } catch (err: any) {
      alert(err.message || "Upload gagal");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="mb-2 block text-sm text-neutral-300">{label}</span>
      <div className="flex items-center gap-3 rounded-md border border-dashed border-neutral-700 bg-neutral-950 px-4 py-5">
        {value ? (
          <>
            <MaterialIcon name="picture_as_pdf" className="text-2xl text-red-400/80" />
            <span className="min-w-0 flex-1 truncate text-sm text-neutral-300">
              Artwork PDF terpasang
            </span>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 transition-colors hover:bg-neutral-800 disabled:opacity-50"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded border border-neutral-700 px-2.5 py-1.5 text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              Hapus
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 text-neutral-400 transition-colors hover:text-white disabled:opacity-50"
          >
            <MaterialIcon name={uploading ? "hourglass_top" : "upload_file"} className="text-xl" />
            <span className="text-sm">{uploading ? "Uploading…" : "Upload artwork (PDF)"}</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </div>
  );
}
