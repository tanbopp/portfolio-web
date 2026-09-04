"use client";

import { useRef } from "react";
import { storageUrl } from "@/lib/supabase";
import MaterialIcon from "@/components/MaterialIcon";
import type { PendingMap } from "./ImagePicker";

export interface GalleryItem {
  media: string;
  media_type: "image" | "video";
}

/** Resolve the preview source for an item (existing path vs pending blob). */
function previewOf(item: GalleryItem): string | undefined {
  return item.media?.startsWith("blob:")
    ? item.media
    : (storageUrl(item.media) ?? undefined);
}

export default function GalleryUploader({
  items,
  onChange,
  pending,
}: {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  pending: PendingMap;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const added: GalleryItem[] = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      pending.current.set(url, file);
      return { media: url, media_type: "image" };
    });
    onChange([...items, ...added]);
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
            <img src={previewOf(item)} alt="" className="h-full w-full object-cover" />
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
          onClick={() => inputRef.current?.click()}
          className="flex aspect-video flex-col items-center justify-center gap-1 rounded-md border border-dashed border-neutral-700 text-neutral-400 transition-colors hover:border-neutral-500 hover:text-white"
        >
          <MaterialIcon name="add" className="text-2xl" />
          <span className="text-xs">Tambah</span>
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
