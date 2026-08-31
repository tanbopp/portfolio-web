"use client";

import { useRef, useState } from "react";
import MaterialIcon from "@/components/MaterialIcon";

const TOOLS: { label: string; icon: string; cmd: string; val?: string }[] = [
  { label: "Bold", icon: "format_bold", cmd: "bold" },
  { label: "Italic", icon: "format_italic", cmd: "italic" },
  { label: "Underline", icon: "format_underlined", cmd: "underline" },
  { label: "Heading 1", icon: "title", cmd: "formatBlock", val: "h1" },
  { label: "Heading 2", icon: "format_size", cmd: "formatBlock", val: "h2" },
  { label: "Paragraph", icon: "format_paragraph", cmd: "formatBlock", val: "p" },
  { label: "Bullet list", icon: "format_list_bulleted", cmd: "insertUnorderedList" },
  { label: "Numbered list", icon: "format_list_numbered", cmd: "insertOrderedList" },
  { label: "Quote", icon: "format_quote", cmd: "formatBlock", val: "blockquote" },
];

export default function RichEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function exec(cmd: string, val?: string) {
    ref.current?.focus();
    document.execCommand(cmd, false, val);
    onChange(ref.current?.innerHTML ?? "");
  }

  async function insertImage(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");
      exec("insertImage", data.url);
    } catch (err: any) {
      alert(err.message || "Upload gagal");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="rounded-md border border-neutral-700 bg-black">
      <div className="flex flex-wrap items-center gap-1 border-b border-neutral-700 p-2">
        {TOOLS.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(t.cmd, t.val)}
            className="flex h-8 w-8 items-center justify-center rounded text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <MaterialIcon name={t.icon} className="text-[18px]" />
          </button>
        ))}
        <button
          type="button"
          title="Insert image"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="flex h-8 w-8 items-center justify-center rounded text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:opacity-50"
        >
          <MaterialIcon name={uploading ? "hourglass_top" : "image"} className="text-[18px]" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) insertImage(f);
          }}
        />
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLElement).innerHTML)}
        className="min-h-[260px] max-h-[480px] overflow-y-auto p-4 text-sm text-neutral-100 outline-none"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
