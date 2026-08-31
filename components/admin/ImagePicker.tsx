"use client";

import { useRef, useState } from "react";
import { storageUrl } from "@/lib/supabase";
import MaterialIcon from "@/components/MaterialIcon";

/**
 * Large image dropzone. `aspect` controls the container ratio, e.g.
 * "aspect-[2/1]" for the hero image, "aspect-video" (16:9) for the card.
 */
export default function ImagePicker({
  label,
  value,
  onChange,
  aspect = "aspect-[2/1]",
}: {
  label: string;
  value: string | null;
  onChange: (path: string | null) => void;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
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

  const preview = storageUrl(value);

  return (
    <div>
      <span className="mb-2 block text-sm text-neutral-300">{label}</span>
      <div
        className={`relative w-full ${aspect} overflow-hidden rounded-md border border-neutral-800 bg-neutral-950`}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={label} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-300 hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="btn btn--primary text-sm"
              >
                Ganti
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="btn btn--secondary text-sm"
              >
                Hapus
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white disabled:opacity-50"
          >
            <MaterialIcon name={uploading ? "hourglass_top" : "add_circle_outline"} className="text-5xl" />
            <span className="text-sm">{uploading ? "Uploading..." : "Tambah gambar"}</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </div>
  );
}
