"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TipTapEditor from "./tiptap/TipTapEditor";
import ImagePicker from "./ImagePicker";
import GalleryUploader, { type GalleryItem } from "./GalleryUploader";
import type { Project } from "@/lib/types";

interface Props {
  initial?: Project | null;
  isEdit?: boolean;
}

const inputCls =
  "mt-1 w-full rounded border border-neutral-700 bg-black px-3 py-2 text-white outline-none focus:border-neutral-500";
const inputRowCls =
  "w-full rounded border border-neutral-700 bg-black px-3 py-2 text-white outline-none focus:border-neutral-500";
const labelCls = "mb-1 block text-sm text-neutral-300";
const addRowBtnCls =
  "rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 transition-colors hover:bg-neutral-800";
const removeRowBtnCls =
  "shrink-0 self-start rounded border border-neutral-700 px-2.5 py-2 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white";

function listToText(list: string[] | null | undefined): string {
  return (list ?? []).join(", ");
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
  const [platform, setPlatform] = useState<string[]>(initial?.platform ?? []);
  const [technologies, setTechnologies] = useState(listToText(initial?.technologies));
  const [actions, setActions] = useState<{ label: string; url: string }[]>(initial?.actions ?? []);
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

  function updatePlatform(i: number, val: string) {
    setPlatform((prev) => prev.map((x, idx) => (idx === i ? val : x)));
  }
  function removePlatform(i: number) {
    setPlatform((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addPlatform() {
    setPlatform((prev) => [...prev, ""]);
  }

  function updateAction(i: number, field: "label" | "url", val: string) {
    setActions((prev) => prev.map((a, idx) => (idx === i ? { ...a, [field]: val } : a)));
  }
  function removeAction(i: number) {
    setActions((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addAction() {
    setActions((prev) => [...prev, { label: "", url: "" }]);
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
      platform: platform.map((p) => p.trim()).filter(Boolean),
      technologies: splitList(technologies),
      actions: actions
        .map((a) => ({ label: a.label.trim(), url: a.url.trim() }))
        .filter((a) => a.label || a.url),
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
          <label className={labelCls}>Technologies (pisahkan dgn koma)</label>
          <input className={inputCls} value={technologies} onChange={(e) => setTechnologies(e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Platform</label>
          <div className="mt-1 space-y-2">
            {platform.map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className={inputRowCls}
                  value={val}
                  onChange={(e) => updatePlatform(i, e.target.value)}
                  placeholder={`Platform ${i + 1}`}
                />
                <button type="button" onClick={() => removePlatform(i)} title="Hapus" className={removeRowBtnCls}>
                  ✕
                </button>
              </div>
            ))}
            {platform.length === 0 && <p className="text-xs text-neutral-500">Belum ada platform.</p>}
            <button type="button" onClick={addPlatform} className={addRowBtnCls}>
              + Tambah Platform
            </button>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Actions (tombol)</label>
          <div className="mt-1 space-y-2">
            {actions.map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <input
                  className={inputRowCls}
                  value={a.label}
                  onChange={(e) => updateAction(i, "label", e.target.value)}
                  placeholder="Label (mis. View Website)"
                />
                <input
                  className={inputRowCls}
                  value={a.url}
                  onChange={(e) => updateAction(i, "url", e.target.value)}
                  placeholder="URL (https://…)"
                />
                <button type="button" onClick={() => removeAction(i)} title="Hapus" className={removeRowBtnCls}>
                  ✕
                </button>
              </div>
            ))}
            {actions.length === 0 && <p className="text-xs text-neutral-500">Belum ada tombol.</p>}
            <button type="button" onClick={addAction} className={addRowBtnCls}>
              + Tambah Tombol
            </button>
          </div>
        </div>
      </div>

      <GalleryUploader items={gallery} onChange={setGallery} />

      <div>
        <label className={labelCls}>Showcase</label>
        <TipTapEditor value={showcase} onChange={setShowcase} />
      </div>

      <div>
        <label className={labelCls}>Article</label>
        <TipTapEditor value={article} onChange={setArticle} />
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
