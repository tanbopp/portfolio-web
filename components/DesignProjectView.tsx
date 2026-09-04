import type { ReactNode } from "react";
import Container from "./Container";
import Button from "./Button";
import RichContent from "./RichContent";
import PacdoraEmbed from "./PacdoraEmbed";
import ArtworkViewer from "./ArtworkViewer";
import { storageUrl } from "@/lib/supabase";
import type { Project } from "@/lib/types";

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <span className="mb-5 block text-xs uppercase tracking-[0.25em] text-neutral-500">
    {children}
  </span>
);

/**
 * Public page layout for DESIGN (packaging) projects.
 * Mirrors the reference layout: title + cover, About / Details / Tools,
 * a full "Preview" (Pacdora 360°), optional artwork, then an auto image grid
 * (if the count is odd, the last tile spans two columns).
 */
export default function DesignProjectView({ project }: { project: Project }) {
  const label = project.work_for || project.deliverables?.[0] || "Packaging Design";
  const cover = storageUrl(project.hero_image || project.card_image);
  const tools = project.technologies ?? [];
  const details: { label: string; value: string }[] = [];
  if (project.year) details.push({ label: "Year", value: project.year });
  (project.deliverables ?? []).forEach((d, i) =>
    details.push({ label: i === 0 ? "Project" : "Deliverable", value: d }),
  );
  (project.platform ?? []).forEach((p, i) =>
    details.push({ label: i === 0 ? "Platform" : "", value: p }),
  );
  const gallery = project.galleries ?? [];
  const odd = gallery.length % 2 === 1;

  return (
    <>
      {/* Title */}
      <section className="w-full bg-black pb-4">
        <Container className="pt-32 sm:pt-36">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-neutral-500">{label}</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-1.5%] sm:text-6xl">
            {project.title}
          </h1>
        </Container>
      </section>

      {/* Cover */}
      {cover && (
        <section className="w-full">
          <Container>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={project.title}
              className="aspect-[4/3] w-full rounded-xl object-cover"
            />
          </Container>
        </section>
      )}

      {/* About + Details + Tools */}
      <section className="w-full py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_320px]">
            {/* About */}
            <div data-aos="fade-up">
              <SectionLabel>About</SectionLabel>
              {project.description ? (
                <div className="max-w-2xl space-y-4 text-neutral-300 [&_p]:text-lg [&_p]:leading-relaxed">
                  {project.description.split("\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <p className="max-w-2xl text-neutral-500">Belum ada deskripsi.</p>
              )}
              {project.article && (
                <div className="mt-6">
                  <RichContent html={project.article} />
                </div>
              )}
            </div>

            {/* Details + Tools */}
            <div className="space-y-10" data-aos="fade-up">
              {details.length > 0 && (
                <div>
                  <SectionLabel>Details</SectionLabel>
                  <dl className="space-y-3 text-neutral-300">
                    {details.map((d, i) => (
                      <div
                        key={i}
                        className="flex gap-6 border-b border-neutral-800/80 pb-3"
                      >
                        <dt className="w-24 shrink-0 text-xs uppercase tracking-wider text-neutral-500">
                          {d.label}
                        </dt>
                        <dd className="flex-1 text-base">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {tools.length > 0 && (
                <div>
                  <SectionLabel>Tools</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.actions && project.actions.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {project.actions.map((a, i) => (
                    <Button
                      key={i}
                      href={a.url || "#"}
                      target="_blank"
                      rel="noopener"
                      variant={i === 0 ? "primary" : "secondary"}
                      icon="open_in_new"
                    >
                      {a.label || "Visit"}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Preview — Pacdora 360° */}
      {project.pacdora_url && (
        <section className="w-full bg-black py-16">
          <Container>
            <SectionLabel>Preview</SectionLabel>
            <PacdoraEmbed url={project.pacdora_url} title={`${project.title} — preview 360°`} />
          </Container>
        </section>
      )}

      {/* Artwork */}
      {project.artwork_pdf && (
        <section className="w-full border-t border-neutral-800/80 bg-black py-16">
          <Container>
            <SectionLabel>Artwork</SectionLabel>
            <ArtworkViewer file={project.artwork_pdf} />
          </Container>
        </section>
      )}

      {/* Gallery — auto grid; an odd count makes the last tile span 2 columns */}
      {gallery.length > 0 && (
        <section className="w-full bg-black py-16">
          <Container>
            <SectionLabel>Gallery</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {gallery.map((g, i) => {
                const isLast = i === gallery.length - 1;
                const spanTwo = odd && isLast;
                return g.media_type === "video" ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    key={g.id}
                    src={storageUrl(g.media) ?? undefined}
                    controls
                    className={`w-full rounded-lg object-cover ${
                      spanTwo ? "aspect-[16/8] sm:col-span-2" : "aspect-[4/3]"
                    }`}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={g.id}
                    src={storageUrl(g.media) ?? undefined}
                    alt={`${project.title} ${i + 1}`}
                    loading="lazy"
                    className={`w-full rounded-lg object-cover ${
                      spanTwo ? "aspect-[16/8] sm:col-span-2" : "aspect-[4/3]"
                    }`}
                  />
                );
              })}
            </div>
          </Container>
        </section>
      )}

      <section className="w-full pb-20">
        <Container>
          <Button href="/" variant="secondary" icon="chevron_left">
            Back to Home
          </Button>
        </Container>
      </section>
    </>
  );
}
