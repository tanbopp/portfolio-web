"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CkEditor from "./CkEditor";
import ImagePicker from "./ImagePicker";
import GalleryUploader, { type GalleryItem } from "./GalleryUploader";
import type { Project } from "@/lib/types";

interface Props {
  initial?: Project | null;
  isEdit?: boolean;
}

const inputCls =
  "mt-1 w-full rounded border border-neutral-700 bg-black px-3 py-2 text-white outline-none focus:border-neutral-500";
const labelCls = "mb-1 block text-sm text-neutral-300";

function listToText(list: string[] | null | undefined): string {
  return (list ?? []).join(", ");
}

function actionsToText(actions: { label: string; url: string }[] | null | undefined): string {
  return (actions ?? []).map((a) => `${a.label}|${a.url}`).join("\n");
}

export default function ProjectForm({ initial, isEdit = false }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [workFor, setWorkFor] = useState(initial?.work_for ?? "");
  const [year, setYear] = useState(initial?.year ?? "");
  const [deliverables, setDeliverables] = useState(listToText(initial?.deliverables));
  const [platform, setPlatform] = useState(listToText(initial?.platform));
  const [technologies, setTechnologies] = useState(listToText(initial?.technologies));
  const [actions, setActions] = useState(actionsToText(initial?.actions));
  const [showcase, setShowcase] = useState(initial?.showcase ?? "");
  const [article, setArticle] = useState(initial?.article ?? "");
  const [heroImage, setHeroImage] = useState<string | null>(initial?.hero_image ?? null);
  const [cardImage, setCardImage] = useState<string | null>(initial?.card_image ?? null);
  const [gallery, setGallery] = useState<GalleryItem[]>(
    initial?.galleries?.map((g) => ({ media: g.media, media_type: g.media_type })) ?? [],
  );
  const [published, setPublished] = useState(initial?.published ?? true);

  function splitList(text: string): string[] {
    return text.split(",").map((s) => s.trim()).filter(Boolean);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      title,
      description,
      slug,
      work_for: workFor,
      year,
      deliverables: splitList(deliverables),
      platform: splitList(platform),
      technologies: splitList(technologies),
      actions: actions
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [label, url] = l.split("|");
          return { label: (label || "").trim(), url: (url || "").trim() };
        }),
      showcase,
      article,
      hero_image: heroImage,
      card_image: cardImage,
      gallery: gallery.map((g) => g.media),
      published,
    };

    try {
      const url = isEdit ? `/api/projects/${initial?.slug}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Hero image — full width, hero ratio (16:8) */}
      <ImagePicker label="Gambar Hero (16:8)" value={heroImage} onChange={setHeroImage} aspect="aspect-[2/1]" />

      {/* Card image — card ratio (16:9) */}
      <ImagePicker label="Gambar Card (16:9)" value={cardImage} onChange={setCardImage} aspect="aspect-video" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Judul *</label>
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Deskripsi singkat</label>
          <textarea
            className={`${inputCls} min-h-[80px]`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
          />
        </div>
        <div>
          <label className={labelCls}>Slug</label>
          <input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-dari judul" />
        </div>
        <div>
          <label className={labelCls}>Tahun</label>
          <input className={inputCls} value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Work for</label>
          <input className={inputCls} value={workFor} onChange={(e) => setWorkFor(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Deliverables (pisahkan dgn koma)</label>
          <input className={inputCls} value={deliverables} onChange={(e) => setDeliverables(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Platform (pisahkan dgn koma)</label>
          <input className={inputCls} value={platform} onChange={(e) => setPlatform(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Technologies (pisahkan dgn koma)</label>
          <input className={inputCls} value={technologies} onChange={(e) => setTechnologies(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Actions (satu per baris: Label|URL)</label>
          <textarea
            className={`${inputCls} min-h-[70px] font-mono text-xs`}
            value={actions}
            onChange={(e) => setActions(e.target.value)}
            placeholder={"View Website|https://example.com\nCase Study|https://example.com"}
          />
        </div>
      </div>

      <GalleryUploader items={gallery} onChange={setGallery} />

      <div>
        <label className={labelCls}>Showcase</label>
        <CkEditor value={showcase} onChange={setShowcase} />
      </div>

      <div>
        <label className={labelCls}>Article</label>
        <CkEditor value={article} onChange={setArticle} />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4"
        />
        Published
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn btn--primary disabled:opacity-50">
          {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Project"}
        </button>
        <button type="button" onClick={() => router.push("/admin")} className="btn btn--secondary">
          Batal
        </button>
      </div>
    </form>
  );
}
