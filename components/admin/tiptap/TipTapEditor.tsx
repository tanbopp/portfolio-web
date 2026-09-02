"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import { VideoBlock } from "./VideoNode";
import { CarouselBlock } from "./CarouselNode";
import "./tiptap-editor.css";

type SlashItem = { key: string; label: string; run: () => void };

export default function TipTapEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const [slashOpen, setSlashOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const slashItemsRef = useRef<SlashItem[]>([]);
  const slashOpenRef = useRef(false);
  const highlightRef = useRef(0);

  slashOpenRef.current = slashOpen;
  highlightRef.current = highlight;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      VideoBlock,
      CarouselBlock,
      Placeholder.configure({ placeholder: "Tulis di sini… ketik / untuk separator, video, carousel" }),
    ],
    content: value || "",
    editorProps: {
      attributes: { class: "tb-editable" },
      handleKeyDown: (_view, event) => {
        if (slashOpenRef.current) {
          if (event.key === "Escape") {
            closeSlash();
            return true;
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            moveHighlight(1);
            return true;
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            moveHighlight(-1);
            return true;
          }
          if (event.key === "Enter") {
            event.preventDefault();
            choose();
            return true;
          }
          if (event.key === "Backspace") {
            setQuery((q) => q.slice(0, -1));
            return true;
          }
          if (event.key.length === 1) {
            setQuery((q) => q + event.key);
            return true;
          }
          return false;
        }
        if (event.key === "/") {
          const can = canOpenSlash();
          if (can) {
            event.preventDefault();
            setQuery("");
            setHighlight(0);
            setSlashOpen(true);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  function canOpenSlash() {
    if (!editor) return false;
    const { $from } = editor.state.selection;
    if (editor.state.selection.empty === false) return false;
    // Only when at the start of an empty paragraph
    const parent = $from.parent;
    if (parent.type.name !== "paragraph") return false;
    return $from.parent.textContent === "" && $from.parentOffset === 0;
  }

  function closeSlash() {
    setSlashOpen(false);
    setQuery("");
  }

  function moveHighlight(dir: number) {
    const n = slashItemsRef.current.length;
    if (!n) return;
    setHighlight((h) => (h + dir + n) % n);
  }

  function buildChoices(): SlashItem[] {
    return [
      { key: "separator", label: "separator", run: () => editor?.chain().focus().setHorizontalRule().run() },
      {
        key: "video",
        label: "video",
        run: () => editor?.chain().focus().insertContent({ type: "videoBlock" }).run(),
      },
      {
        key: "carousel",
        label: "carousel",
        run: () => editor?.chain().focus().insertContent({ type: "carouselBlock" }).run(),
      },
    ].filter((it) => it.key.startsWith(query.toLowerCase()));
  }

  function choose() {
    const item = slashItemsRef.current[highlightRef.current];
    setSlashOpen(false);
    setQuery("");
    if (item) item.run();
  }

  useEffect(() => {
    slashItemsRef.current = buildChoices();
    setHighlight((h) => Math.min(h, Math.max(0, slashItemsRef.current.length - 1)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, slashOpen]);

  if (!editor) return null;

  const btn = (label: string, on: boolean, fn: () => void, title?: string) => (
    <button
      type="button"
      title={title || label}
      className={"tb-tbtn" + (on ? " on" : "")}
      onMouseDown={(e) => e.preventDefault()}
      onClick={fn}
    >
      {label}
    </button>
  );

  async function pickImage() {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return;
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) editor.chain().focus().setImage({ src: data.url }).run();
    };
    input.click();
  }

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("URL tautan:", prev);
    if (url === null) return;
    if (url.trim() === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  const active = {
    h1: editor.isActive("heading", { level: 1 }),
    h2: editor.isActive("heading", { level: 2 }),
    bold: editor.isActive("bold"),
    italic: editor.isActive("italic"),
    underline: editor.isActive("underline"),
    bullet: editor.isActive("bulletList"),
    numbered: editor.isActive("orderedList"),
    quote: editor.isActive("blockquote"),
    link: editor.isActive("link"),
    hr: editor.isActive("horizontalRule"),
  };

  return (
    <div className="tb-editor">
      <div className="tb-toolbar">
        {btn("↶", false, () => editor.chain().focus().undo().run(), "Undo")}
        {btn("↷", false, () => editor.chain().focus().redo().run(), "Redo")}
        <span className="tb-sep" />
        {btn("H1", active.h1, () => editor.chain().focus().toggleHeading({ level: 1 }).run())}
        {btn("H2", active.h2, () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        {btn("¶", false, () => editor.chain().focus().setParagraph().run())}
        <span className="tb-sep" />
        {btn("B", active.bold, () => editor.chain().focus().toggleBold().run())}
        {btn("I", active.italic, () => editor.chain().focus().toggleItalic().run())}
        {btn("U", active.underline, () => editor.chain().focus().toggleUnderline().run())}
        <span className="tb-sep" />
        {btn("•", active.bullet, () => editor.chain().focus().toggleBulletList().run())}
        {btn("1.", active.numbered, () => editor.chain().focus().toggleOrderedList().run())}
        {btn("❝", active.quote, () => editor.chain().focus().toggleBlockquote().run())}
        <span className="tb-sep" />
        {btn("🔗", active.link, () => setLink(), "Tautan")}
        {btn("🖼", false, () => pickImage(), "Upload gambar")}
        {btn("—", active.hr, () => editor.chain().focus().setHorizontalRule().run(), "Separator")}
      </div>

      <div className="tb-content-wrap">
        <EditorContent editor={editor} />

        {slashOpen && (
          <div className="tb-slash-menu">
            <div className="tb-slash-heading">Insert block</div>
            {slashItemsRef.current.map((it, i) => (
              <button
                key={it.key}
                type="button"
                className={"tb-slash-item" + (i === highlight ? " tb-sel" : "")}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setSlashOpen(false);
                  setQuery("");
                  it.run();
                }}
              >
                /{it.label}
              </button>
            ))}
            {slashItemsRef.current.length === 0 && (
              <div className="tb-slash-empty">Tidak ada hasil</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
