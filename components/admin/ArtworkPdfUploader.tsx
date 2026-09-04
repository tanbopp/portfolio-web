"use client";

import { useRef } from "react";
import MaterialIcon from "@/components/MaterialIcon";
import type { PendingMap } from "./ImagePicker";

/**
 * Uploader untuk artwork PDF. Hanya men-*stage* file secara lokal (object URL +
 * entri di `pending`) — tidak menyimpan apa pun sampai project disimpan.
 * Untuk file baru yang dipilih, pratinjau ditampilkan via object URL lokal.
 */
export default function ArtworkPdfUploader({
  label,
  value,
  onChange,
  pending,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  pending: PendingMap;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isPending = !!value?.startsWith("blob:");

  return (
    <div>
      <span className="mb-2 block text-sm text-neutral-300">{label}</span>
      <div className="rounded-md border border-dashed border-neutral-700 bg-neutral-950 px-4 py-5">
        {value ? (
          <>
            <div className="mb-3 flex items-center gap-3">
              <MaterialIcon name="picture_as_pdf" className="text-2xl text-red-400/80" />
              <span className="min-w-0 flex-1 truncate text-sm text-neutral-300">
                {isPending ? "Artwork PDF baru (belum disimpan)" : "Artwork PDF terpasang"}
              </span>
            </div>
            {isPending && value && (
              <iframe
                src={value}
                title="Pratinjau artwork"
                className="mb-3 h-56 w-full rounded-md border border-neutral-800 bg-white"
              />
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 transition-colors hover:bg-neutral-800"
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
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 text-neutral-400 transition-colors hover:text-white"
          >
            <MaterialIcon name="upload_file" className="text-xl" />
            <span className="text-sm">Upload artwork (PDF)</span>
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
