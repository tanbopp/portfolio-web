"use client";

import { useEffect, useRef, useState } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import MaterialIcon from "@/components/MaterialIcon";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
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
      // NOTE: StarterKit v3 already bundles Link & Underline (plus undo/redo,
      // trailing-node). We only configure them here to avoid duplicate extensions.
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false },
      }),
      Image,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      VideoBlock,
      CarouselBlock,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
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

  // Text-only button (headings, paragraph)
  const txtBtn = (label: string, on: boolean, fn: () => void, title?: string) => (
    <button
      type="button"
      title={title || label}
      className={"tb-tbtn tb-txt" + (on ? " on" : "")}
      onMouseDown={(e) => e.preventDefault()}
      onClick={fn}
    >
      {label}
    </button>
  );

  // Material-icon button (toolbar)
  const iconBtn = (name: string, on: boolean, fn: () => void, title: string) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={"tb-tbtn" + (on ? " on" : "")}
      onMouseDown={(e) => e.preventDefault()}
      onClick={fn}
    >
      <MaterialIcon name={name} className="tb-ic" />
    </button>
  );

  // Smaller icon button used inside the bubble menu
  const bb = (name: string, on: boolean, fn: () => void, title: string) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={"tb-bb" + (on ? " on" : "")}
      onMouseDown={(e) => e.preventDefault()}
      onClick={fn}
    >
      <MaterialIcon name={name} className="tb-ic" />
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
    h3: editor.isActive("heading", { level: 3 }),
    bold: editor.isActive("bold"),
    italic: editor.isActive("italic"),
    underline: editor.isActive("underline"),
    bullet: editor.isActive("bulletList"),
    numbered: editor.isActive("orderedList"),
    quote: editor.isActive("blockquote"),
    link: editor.isActive("link"),
    hr: editor.isActive("horizontalRule"),
    alignLeft: editor.isActive({ textAlign: "left" }),
    alignCenter: editor.isActive({ textAlign: "center" }),
    alignRight: editor.isActive({ textAlign: "right" }),
    alignJustify: editor.isActive({ textAlign: "justify" }),
  };

  return (
    <div className="tb-editor">
      <div className="tb-toolbar">
        {iconBtn("undo", false, () => editor.chain().focus().undo().run(), "Undo")}
        {iconBtn("redo", false, () => editor.chain().focus().redo().run(), "Redo")}
        <span className="tb-sep" />
        {txtBtn("H1", active.h1, () => editor.chain().focus().toggleHeading({ level: 1 }).run(), "Heading 1")}
        {txtBtn("H2", active.h2, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), "Heading 2")}
        {txtBtn("H3", active.h3, () => editor.chain().focus().toggleHeading({ level: 3 }).run(), "Heading 3")}
        {txtBtn("¶", false, () => editor.chain().focus().setParagraph().run(), "Paragraf")}
        <span className="tb-sep" />
        {iconBtn("format_bold", active.bold, () => editor.chain().focus().toggleBold().run(), "Tebal (Bold)")}
        {iconBtn("format_italic", active.italic, () => editor.chain().focus().toggleItalic().run(), "Miring (Italic)")}
        {iconBtn("format_underlined", active.underline, () => editor.chain().focus().toggleUnderline().run(), "Garis bawah (Underline)")}
        <span className="tb-sep" />
        {iconBtn("format_list_bulleted", active.bullet, () => editor.chain().focus().toggleBulletList().run(), "Daftar berpoin")}
        {iconBtn("format_list_numbered", active.numbered, () => editor.chain().focus().toggleOrderedList().run(), "Daftar bernomor")}
        {iconBtn("format_quote", active.quote, () => editor.chain().focus().toggleBlockquote().run(), "Kutipan")}
        <span className="tb-sep" />
        {iconBtn("format_align_left", active.alignLeft, () => editor.chain().focus().setTextAlign("left").run(), "Rata kiri")}
        {iconBtn("format_align_center", active.alignCenter, () => editor.chain().focus().setTextAlign("center").run(), "Rata tengah")}
        {iconBtn("format_align_right", active.alignRight, () => editor.chain().focus().setTextAlign("right").run(), "Rata kanan")}
        {iconBtn("format_align_justify", active.alignJustify, () => editor.chain().focus().setTextAlign("justify").run(), "Rata kanan-kiri (justify)")}
        <span className="tb-sep" />
        {iconBtn("link", active.link, () => setLink(), "Tautan")}
        {iconBtn("image", false, () => pickImage(), "Upload gambar")}
        {iconBtn("smart_display", false, () => editor.chain().focus().insertContent({ type: "videoBlock" }).run(), "Video (YouTube/Vimeo/mp4)")}
        {iconBtn("photo_library", false, () => editor.chain().focus().insertContent({ type: "carouselBlock" }).run(), "Galeri gambar (carousel)")}
        {iconBtn("horizontal_rule", active.hr, () => editor.chain().focus().setHorizontalRule().run(), "Separator")}
      </div>

      <div className="tb-content-wrap">
        <EditorContent editor={editor} />

        <BubbleMenu editor={editor} className="tb-bubble">
          <div className="tb-bubble-inner">
            {bb("format_bold", active.bold, () => editor.chain().focus().toggleBold().run(), "Tebal (Bold)")}
            {bb("format_italic", active.italic, () => editor.chain().focus().toggleItalic().run(), "Miring (Italic)")}
            {bb("format_underlined", active.underline, () => editor.chain().focus().toggleUnderline().run(), "Garis bawah (Underline)")}
            <span className="tb-bsep" />
            {bb("link", active.link, () => setLink(), "Tautan")}
            {active.link && bb("link_off", false, () => editor.chain().focus().unsetLink().run(), "Hapus tautan")}
          </div>
        </BubbleMenu>

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
