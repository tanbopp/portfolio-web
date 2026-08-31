"use client";

import { useRef, useState } from "react";
import { storageUrl } from "@/lib/supabase";

export default function ImagePicker({
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
      <span className="mb-1 block text-sm text-neutral-300">{label}</span>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt={label}
          className="mb-2 h-40 w-full rounded-md border border-neutral-800 object-cover"
        />
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="btn btn--secondary text-sm disabled:opacity-50"
        >
          {uploading ? "Uploading..." : value ? "Ganti gambar" : "Upload gambar"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded border border-neutral-700 px-3 py-2 text-sm text-neutral-400 hover:text-white"
          >
            Hapus
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
