"use client";

import { useRef } from "react";
import MaterialIcon from "./MaterialIcon";

/**
 * Full-bleed Pacdora 360° packaging embed.
 * The wrapper can be sent to browser fullscreen so the interactive preview is
 * easy to rotate. The iframe itself is also allowFullScreen for embedded
 * fullscreen where the host supports it.
 */
export default function PacdoraEmbed({ url, title }: { url: string; title?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen?.().catch(() => {});
    }
  };

  return (
    <div ref={wrapRef} className="pacdora-wrap relative w-full">
      <div className="pacdora-frame relative w-full aspect-[16/9] overflow-hidden rounded-md border border-neutral-800 bg-black">
        <iframe
          src={url}
          title={title || "Pacdora 360° packaging preview"}
          className="absolute inset-0 h-full w-full border-0"
          allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox allow-forms"
        />
      </div>
      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-md border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-black/80"
        aria-label="Fullscreen"
      >
        <MaterialIcon name="fullscreen" className="text-base" />
        <span className="hidden sm:inline">Fullscreen</span>
      </button>
    </div>
  );
}
