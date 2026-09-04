"use client";

import { useRef } from "react";
import { storageUrl } from "@/lib/supabase";
import MaterialIcon from "@/components/MaterialIcon";

export type PendingMap = { current: Map<string, File> };

/**
 * Large image dropzone. It does NOT upload anywhere — it only stages the chosen
 * file locally (object URL + entry in `pending`), so nothing is stored until the
 * project form is actually saved. `value` is either an existing storage path or
 * a `blob:` preview for a pending upload.
 */
export default function ImagePicker({
  label,
  value,
  onChange,
  pending,
  aspect = "aspect-[2/1]",
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  pending: PendingMap;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = value?.startsWith("blob:") ? value : storageUrl(value);

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
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white"
          >
            <MaterialIcon name="add_circle_outline" className="text-5xl" />
            <span className="text-sm">Tambah gambar</span>
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
          if (f) {
            const url = URL.createObjectURL(f);
            pending.current.set(url, f);
            onChange(url);
          }
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
    </div>
  );
}

