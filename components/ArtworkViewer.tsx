"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MaterialIcon from "./MaterialIcon";
import { artworkUrl, storageUrl } from "@/lib/supabase";

type PageData = { src: string; w: number; h: number };

// pdf.js worker served as a static asset in /public.
const PDF_WORKER = "/pdf.worker.min.mjs";

/**
 * Canvas-style PDF artwork viewer.
 *
 * Loads the PDF from its public storage URL (or full URL) and renders each page
 * with pdf.js onto an offscreen canvas, then shows the result inside a
 * pannable + zoomable stage (drag to pan, wheel/buttons to zoom). There is no
 * download button/control in the UI.
 */
export default function ArtworkViewer({ file }: { file: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [pages, setPages] = useState<PageData[]>([]);
  const [maxW, setMaxW] = useState(1);
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const [errorMsg, setErrorMsg] = useState("");
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const dragRef = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null);
  const fitS = viewportRef.current
    ? viewportRef.current.clientWidth / maxW
    : 1;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Try the artwork bucket first; fall back to the projects bucket and to
        // any full URL stored in artwork_pdf.
        const candidates = [artworkUrl(file), storageUrl(file)].filter(
          (u): u is string => !!u,
        );
        let res: Response | null = null;
        for (const u of candidates) {
          const r = await fetch(u);
          if (r.ok) {
            res = r;
            setLoadedUrl(u);
            break;
          }
        }
        if (!res) throw new Error("File tidak ditemukan (cek bucket/file)");
        const buf = await res.arrayBuffer();
        const pdfjs: any = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER;
        const doc = await pdfjs.getDocument({ data: buf }).promise;

        const rendered: PageData[] = [];
        let w = 1;
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const v1 = page.getViewport({ scale: 1 });
          const scale = Math.min(2.5, 4096 / v1.width);
          const vp = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(vp.width);
          canvas.height = Math.floor(vp.height);
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          rendered.push({
            src: canvas.toDataURL("image/png"),
            w: canvas.width,
            h: canvas.height,
          });
          w = Math.max(w, canvas.width);
        }
        if (cancelled) return;
        setPages(rendered);
        setMaxW(w);
        setStatus("ready");
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : String(err));
          setStatus("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Fit the artwork to the viewport width once we know its size.
  useEffect(() => {
    if (status === "ready" && viewportRef.current) {
      const s = viewportRef.current.clientWidth / maxW;
      setView({ s, x: 0, y: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const clampS = (s: number) => Math.min(12, Math.max(0.1, s));

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      const el = viewportRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // zoom factor
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const ns = clampS(view.s * factor);
      const k = ns / view.s;
      // keep the point under the cursor fixed
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const nx = cx - k * (cx - view.x);
      const ny = cy - k * (cy - view.y);
      setView({ s: ns, x: nx, y: ny });
    },
    [view],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { sx: e.clientX, sy: e.clientY, px: view.x, py: view.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setView({ ...view, x: d.px + (e.clientX - d.sx), y: d.py + (e.clientY - d.sy) });
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const zoomBy = (factor: number) => {
    setView((v) => ({ ...v, s: clampS(v.s * factor) }));
  };

  return (
    <div className="artwork-viewer">
      <div className="artwork-toolbar">
        <button type="button" onClick={() => zoomBy(1.2)} aria-label="Perbesar" title="Perbesar">
          <MaterialIcon name="add" />
        </button>
        <button type="button" onClick={() => zoomBy(1 / 1.2)} aria-label="Perkecil" title="Perkecil">
          <MaterialIcon name="remove" />
        </button>
        <button
          type="button"
          onClick={() => setView({ s: fitS, x: 0, y: 0 })}
          title="Sesuaikan"
          aria-label="Sesuaikan ukuran"
        >
          <MaterialIcon name="fit_screen" />
        </button>
        <span className="artwork-hint">Scroll untuk zoom · tahan &amp; geser untuk melihat</span>
      </div>

      <div
        ref={viewportRef}
        className="artwork-stage"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {status === "loading" && (
          <div className="artwork-msg">Memuat artwork…</div>
        )}
        {status === "error" &&
          (loadedUrl ? (
            <iframe src={loadedUrl} title="Artwork" className="artwork-fallback" />
          ) : (
            <div className="artwork-msg">
              Gagal memuat artwork{errorMsg ? `: ${errorMsg}` : ""}.
            </div>
          ))}
        {status === "ready" && (
          <div
            className="artwork-inner"
            style={{
              width: maxW,
              transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.s})`,
              transformOrigin: "0 0",
            }}
          >
            {pages.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={p.src}
                alt=""
                draggable={false}
                style={{ width: p.w, height: p.h }}
                className="artwork-page"
              />
            ))}
          </div>
        )}
      </div>
      <p className="artwork-note">Gunakan zoom &amp; geser untuk meninjau artwork.</p>
    </div>
  );
}
