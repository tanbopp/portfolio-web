import { notFound } from "next/navigation";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import { getProjectBySlug } from "@/lib/projects";
import { storageUrl } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const label = project.deliverables?.[0] ?? "Project";
  const heroSrc = storageUrl(project.hero_image);
  const hasMeta =
    project.work_for ||
    project.year ||
    (project.platform && project.platform.length > 0) ||
    (project.deliverables && project.deliverables.length > 0);

  return (
    <>
      {/* Title (above hero) */}
      <section className="relative w-full overflow-hidden border-b border-neutral-800/80 bg-black">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <Container className="relative pt-32 pb-16">
          <p className="mb-3 text-sm uppercase tracking-widest text-neutral-400">{label}</p>
          <h1 className="text-3xl font-semibold tracking-[-1.5%] sm:text-5xl">{project.title}</h1>
          {project.description && (
            <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-neutral-400 font-medium">
              {project.description}
            </p>
          )}
        </Container>
      </section>

      {/* Hero */}
      <section className="relative w-full aspect-[16/8] overflow-hidden">
        {heroSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroSrc} alt={project.title} className="absolute inset-0 h-full w-full object-cover" />
        )}
      </section>

      {/* Meta + actions */}
      <section className="w-full py-8">
        <Container className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-8">
            {project.work_for && (
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-500">Work for</span>
                <p className="mt-1 text-2xl font-thin">{project.work_for}</p>
              </div>
            )}

            {project.year && (
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-500">Year</span>
                <p className="mt-1 text-2xl font-thin">{project.year}</p>
              </div>
            )}

            {project.platform && project.platform.length > 0 && (
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-500">Platform</span>
                <div className="mt-1 space-y-1">
                  {project.platform.map((plat) => (
                    <p key={plat} className="text-2xl font-thin">
                      {plat}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {project.deliverables && project.deliverables.length > 0 && (
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-500">Deliverables</span>
                {project.deliverables.length === 1 ? (
                  <p className="mt-1 text-2xl font-thin">{project.deliverables[0]}</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {project.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-neutral-300">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div>
            {project.technologies && project.technologies.length > 0 && (
              <>
                <span className="text-xs uppercase tracking-widest text-neutral-500">Technologies</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((tag) => (
                    <span key={tag} className="rounded-full border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}

            {project.actions && project.actions.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-3">
                {project.actions.map((action, i) => (
                  <Button
                    key={i}
                    href={action.url || "#"}
                    target="_blank"
                    rel="noopener"
                    variant={i === 0 ? "primary" : "secondary"}
                    icon="open_in_new"
                  >
                    {action.label || "Visit"}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Showcase */}
      {project.showcase && (
        <section className="w-full bg-black py-8">
          <Container>
            <div
              className="wysiwyg-content max-w-3xl !text-white"
              dangerouslySetInnerHTML={{ __html: project.showcase }}
            />
          </Container>
        </section>
      )}

      {/* Gallery */}
      {project.galleries && project.galleries.length > 0 && (
        <section className="w-full border-t border-neutral-800/80 bg-black py-8">
          <Container>
            <SectionHeading className="mb-8 text-3xl sm:text-4xl">Gallery</SectionHeading>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.galleries.map((gallery) =>
                gallery.media_type === "video" ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    key={gallery.id}
                    src={storageUrl(gallery.media) ?? undefined}
                    controls
                    className="aspect-video w-full rounded-md object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={gallery.id}
                    src={storageUrl(gallery.media) ?? undefined}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full rounded-md object-cover"
                  />
                ),
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Article */}
      {project.article && (
        <section className="w-full border-t border-neutral-800/80 py-8">
          <Container>
            <SectionHeading className="mb-8 text-3xl sm:text-4xl">Article</SectionHeading>
            <div
              className="wysiwyg-content max-w-3xl !text-white"
              dangerouslySetInnerHTML={{ __html: project.article }}
            />
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
