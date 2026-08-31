"use client";

import { useRef, useState } from "react";
import { storageUrl } from "@/lib/supabase";
import MaterialIcon from "@/components/MaterialIcon";

export interface GalleryItem {
  media: string;
  media_type: "image" | "video";
}

export default function GalleryUploader({
  items,
  onChange,
}: {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const added: GalleryItem[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (res.ok) added.push({ media: data.path, media_type: "image" });
        else alert(data.error || "Upload gagal");
      } catch {
        alert("Upload gagal");
      }
    }
    onChange([...items, ...added]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <span className="mb-2 block text-sm text-neutral-300">Gallery</span>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item, i) => (
          <div
            key={`${item.media}-${i}`}
            className="group relative aspect-video overflow-hidden rounded-md border border-neutral-800"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={storageUrl(item.media) ?? undefined} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded bg-black/70 text-white transition-colors hover:bg-red-600"
              aria-label="Hapus gambar"
            >
              <MaterialIcon name="close" className="text-sm" />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-video flex-col items-center justify-center gap-1 rounded-md border border-dashed border-neutral-700 text-neutral-400 transition-colors hover:border-neutral-500 hover:text-white disabled:opacity-50"
        >
          <MaterialIcon name={uploading ? "hourglass_top" : "add"} className="text-2xl" />
          <span className="text-xs">{uploading ? "Uploading..." : "Tambah"}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
    </div>
  );
}
