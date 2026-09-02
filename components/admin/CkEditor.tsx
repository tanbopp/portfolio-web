"use client";

import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./CKEditorInner"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[260px] rounded-md border border-neutral-700 bg-black p-4 text-sm text-neutral-500">
      Loading editor…
    </div>
  ),
});

export default function CkEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  return (
    <div className="admin-ckeditor">
      <Inner value={value} onChange={onChange} />
    </div>
  );
}
