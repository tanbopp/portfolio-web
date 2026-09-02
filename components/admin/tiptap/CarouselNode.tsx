import { Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useRef, useState } from "react";

function CarouselView({
  node,
  updateAttributes,
  deleteNode,
}: {
  node: any;
  updateAttributes: (attrs: Record<string, unknown>) => void;
  deleteNode: () => void;
}) {
  const images: string[] = Array.isArray(node.attrs.images) ? node.attrs.images : [];
  const [current, setCurrent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const setImages = (next: string[]) => updateAttributes({ images: next });
  const idx = Math.min(Math.max(0, current), Math.max(0, images.length - 1));

  async function upload(files: File[]) {
    setUploading(true);
    const next = [...images];
    for (const f of files) {
      try {
        const fd = new FormData();
        fd.append("file", f);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload gagal");
        next.push(data.url);
      } catch (err: any) {
        // eslint-disable-next-line no-alert
        alert(err?.message || "Upload gagal");
      }
    }
    setImages(next);
    setUploading(false);
  }

  return (
    <NodeViewWrapper className="tb-block tb-carousel tb-ui" data-drag-handle>
      {images.length ? (
        <>
          <div className="tb-caro-stage">
            <img className="tb-caro-img" src={images[idx]} alt="" />
            <button
              type="button"
              className="tb-caro-del"
              title="Hapus gambar ini"
              onClick={() => {
                const next = images.filter((_, i) => i !== idx);
                setImages(next);
                setCurrent(Math.min(idx, Math.max(0, next.length - 1)));
              }}
            >
              ✕
            </button>
            <span className="tb-caro-count">
              {idx + 1}/{images.length}
            </span>
          </div>
          <div className="tb-caro-nav">
            <button
              type="button"
              className="tb-caro-arrow"
              disabled={images.length <= 1}
              onClick={() => setCurrent((idx - 1 + images.length) % images.length)}
            >
              ‹
            </button>
            <button
              type="button"
              className="tb-caro-arrow"
              disabled={images.length <= 1}
              onClick={() => setCurrent((idx + 1) % images.length)}
            >
              ›
            </button>
          </div>
        </>
      ) : (
        <div className="tb-caro-empty">Belum ada gambar.</div>
      )}

      <div className="tb-opts">
        <button
          type="button"
          className="tb-btn"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "Mengunggah…" : "+ Tambah gambar"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length) upload(files);
            e.target.value = "";
          }}
        />
        <span className="tb-hint">atau paste gambar langsung di sini</span>
        <button type="button" className="tb-btn tb-danger" onClick={deleteNode}>
          Hapus carousel
        </button>
      </div>
    </NodeViewWrapper>
  );
}

export const CarouselBlock = Node.create({
  name: "carouselBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: (el) => {
          try {
            const v = JSON.parse(el.getAttribute("data-images") || "[]");
            return Array.isArray(v) ? v : [];
          } catch {
            return [];
          }
        },
        renderHTML: (attrs) => ({ "data-images": JSON.stringify(attrs.images || []) }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.tb-carousel" }];
  },

  renderHTML({ HTMLAttributes }) {
    const a = HTMLAttributes as any;
    return ["div", { class: "tb-block tb-carousel", "data-images": JSON.stringify(a.images || []) }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CarouselView);
  },
});
