import { Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useState } from "react";

function VideoView({
  node,
  updateAttributes,
  deleteNode,
}: {
  node: any;
  updateAttributes: (attrs: Record<string, unknown>) => void;
  deleteNode: () => void;
}) {
  const attrs = node.attrs;
  const [url, setUrl] = useState(attrs.src || "");
  const [autoplay, setAutoplay] = useState(!!attrs.autoplay);

  const preview = () => {
    const src = (node.attrs.src || "").trim();
    if (!src) return <div className="tb-video-empty">Video belum diset — isi URL di bawah.</div>;
    if (isEmbed(src)) {
      return (
        <iframe
          className="tb-iframe"
          src={embedUrl(src, !!node.attrs.autoplay)}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      );
    }
    return (
      <video
        className="tb-video-tag"
        src={src}
        controls
        autoPlay={!!node.attrs.autoplay}
        muted={!!node.attrs.autoplay}
        playsInline={!!node.attrs.autoplay}
        poster={node.attrs.poster || undefined}
        preload="metadata"
      />
    );
  };

  const apply = (patch: Record<string, unknown>) => {
    updateAttributes({ ...attrs, ...patch });
  };

  return (
    <NodeViewWrapper className="tb-block tb-video tb-ui" data-drag-handle>
      <div className="tb-video-preview">{preview()}</div>
      <input
        className="tb-field"
        value={url}
        placeholder="URL video (mp4/webm/YouTube/Vimeo)"
        onChange={(e) => {
          setUrl(e.target.value);
          apply({ src: e.target.value });
        }}
        onKeyDown={(e) => e.stopPropagation()}
      />
      <div className="tb-opts">
        <label className="tb-check">
          <input
            type="checkbox"
            checked={autoplay}
            onChange={(e) => {
              setAutoplay(e.target.checked);
              apply({ autoplay: e.target.checked });
            }}
          />
          Autoplay
        </label>
        <button
          type="button"
          className="tb-btn"
          onClick={() => {
            const u = window.prompt(
              "URL thumbnail (opsional):",
              node.attrs.poster || "",
            );
            if (u != null) apply({ poster: u.trim() });
          }}
        >
          {node.attrs.poster ? "Ganti thumbnail" : "Pasang thumbnail"}
        </button>
        <button type="button" className="tb-btn tb-danger" onClick={deleteNode}>
          Hapus video
        </button>
      </div>
    </NodeViewWrapper>
  );
}

export const VideoBlock = Node.create({
  name: "videoBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      autoplay: {
        default: false,
        parseHTML: (el) => el.getAttribute("data-autoplay") === "1",
      },
      poster: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "div.tb-video" }];
  },

  renderHTML({ HTMLAttributes }) {
    const a = HTMLAttributes as any;
    return [
      "div",
      {
        class: "tb-block tb-video",
        "data-src": a.src || "",
        "data-autoplay": a.autoplay ? "1" : "0",
        "data-poster": a.poster || "",
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoView);
  },
});

function isEmbed(src: string) {
  return /youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com/.test(src);
}
function embedUrl(url: string, autoplay: boolean) {
  let out = url;
  const s = url.match(/youtu\.be\/([\w-]+)/);
  const w = url.match(/[?&]v=([\w-]+)/);
  const e = url.match(/youtube\.com\/embed\/([\w-]+)/);
  const v = url.match(/vimeo\.com\/(\d+)/);
  if (s) out = `https://www.youtube.com/embed/${s[1]}`;
  else if (w) out = `https://www.youtube.com/embed/${w[1]}`;
  else if (e) out = `https://www.youtube.com/embed/${e[1]}`;
  else if (v) out = `https://player.vimeo.com/video/${v[1]}`;
  if (autoplay) {
    const sep = out.includes("?") ? "&" : "?";
    out += /youtube\.com\/embed\/|player\.vimeo\.com/.test(out)
      ? `${sep}autoplay=1&mute=1`
      : `${sep}autoplay=1`;
  }
  return out;
}
