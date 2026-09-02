"use client";

import { useEffect, useRef } from "react";

/**
 * Renders the saved article/showcase HTML and hydrates the custom media blocks
 * (video, carousel, separator) that were inserted with the slash command.
 */
export default function RichContent({ html }: { html: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // VIDEO blocks: <div class="tb-video" data-src data-autoplay data-poster>
    root.querySelectorAll<HTMLDivElement>(".tb-video[data-src]").forEach((box) => {
      const src = (box.getAttribute("data-src") || "").trim();
      if (!src) return;
      const autoplay = box.getAttribute("data-autoplay") === "1";
      const poster = box.getAttribute("data-poster") || "";
      if (isEmbed(src)) {
        const iframe = document.createElement("iframe");
        iframe.className = "tb-iframe";
        iframe.src = embedUrl(src, autoplay);
        iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
        iframe.setAttribute("allowfullscreen", "");
        iframe.loading = "lazy";
        box.replaceChildren(iframe);
      } else {
        const video = document.createElement("video");
        video.className = "tb-video-tag";
        video.controls = true;
        video.preload = "metadata";
        if (autoplay) {
          video.autoplay = true;
          video.muted = true;
          video.playsInline = true;
        }
        if (poster) video.poster = poster;
        video.src = src;
        box.replaceChildren(video);
      }
    });

    // CAROUSEL blocks: <div class="tb-carousel" data-images='["url",...]'>
    root.querySelectorAll<HTMLDivElement>(".tb-carousel[data-images]").forEach((box) => {
      let urls: string[] = [];
      try {
        const parsed = JSON.parse(box.getAttribute("data-images") || "[]");
        if (Array.isArray(parsed)) urls = parsed.filter(Boolean);
      } catch {
        urls = [];
      }
      if (!urls.length) {
        box.remove();
        return;
      }
      buildCarousel(box, urls);
    });
  }, [html]);

  return (
    <div
      ref={rootRef}
      className="wysiwyg-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function buildCarousel(box: HTMLElement, urls: string[]) {
  box.classList.add("tb-caro");
  let index = 0;
  box.innerHTML = "";

  const stage = document.createElement("div");
  stage.className = "tb-caro-stage";

  const arrows = document.createElement("div");
  arrows.className = "tb-caro-arrows";
  const prev = document.createElement("button");
  prev.type = "button";
  prev.className = "tb-caro-arrow";
  prev.setAttribute("aria-label", "Sebelumnya");
  prev.innerHTML = "‹";
  const next = document.createElement("button");
  next.type = "button";
  next.className = "tb-caro-arrow";
  next.setAttribute("aria-label", "Berikutnya");
  next.innerHTML = "›";

  const dotsWrap = document.createElement("div");
  dotsWrap.className = "tb-caro-dots";

  const draw = () => {
    stage.innerHTML = "";
    const img = document.createElement("img");
    img.src = urls[index];
    img.alt = "";
    img.loading = "lazy";
    img.className = "tb-caro-img";
    stage.appendChild(img);
    dotsWrap.innerHTML = "";
    urls.forEach((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "tb-caro-dot" + (i === index ? " on" : "");
      d.setAttribute("aria-label", `Gambar ${i + 1}`);
      d.addEventListener("click", () => {
        index = i;
        draw();
      });
      dotsWrap.appendChild(d);
    });
    if (urls.length === 1) {
      prev.style.visibility = next.style.visibility = "hidden";
    } else {
      prev.style.visibility = next.style.visibility = "visible";
    }
  };

  prev.addEventListener("click", () => {
    index = (index - 1 + urls.length) % urls.length;
    draw();
  });
  next.addEventListener("click", () => {
    index = (index + 1) % urls.length;
    draw();
  });

  arrows.appendChild(prev);
  arrows.appendChild(next);
  box.appendChild(stage);
  box.appendChild(arrows);
  box.appendChild(dotsWrap);
  draw();
}

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
