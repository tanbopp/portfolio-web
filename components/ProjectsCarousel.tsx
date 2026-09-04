"use client";

import { useRef } from "react";
import Container from "./Container";
import SectionHeading from "./SectionHeading";
import IconButton from "./IconButton";
import ProjectCard from "./ProjectCard";
import { storageUrl } from "@/lib/supabase";
import type { Project } from "@/lib/types";

export default function ProjectsCarousel({
  projects,
  title = "Featured Work",
  id = "projects",
  className = "bg-black",
  empty = "Belum ada project untuk ditampilkan.",
}: {
  projects: Project[];
  title?: string;
  id?: string;
  className?: string;
  empty?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 500, behavior: "smooth" });
  };

  return (
    <section id={id} className={`w-full ${className} py-20 overflow-hidden`}>
      <Container className="mb-12">
        <div className="flex flex-wrap items-end justify-between gap-6" data-aos="fade-up">
          <div>
            <SectionHeading className="text-3xl sm:text-5xl">{title}</SectionHeading>
          </div>
          <div className="flex items-center gap-3">
            <IconButton icon="chevron_left" ariaLabel="Sebelumnya" onClick={() => scrollBy(-1)} />
            <IconButton icon="chevron_right" ariaLabel="Berikutnya" onClick={() => scrollBy(1)} />
          </div>
        </div>
      </Container>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          style={{
            paddingLeft: "max(1rem, calc((100vw - 72rem) / 2 + 1.5rem))",
            paddingRight: "max(1rem, calc((100vw - 72rem) / 2 + 1.5rem))",
          }}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x"
        >
          {projects.length === 0 ? (
            <p className="px-8 text-neutral-400">{empty}</p>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                href={`/projects/${project.slug}`}
                title={project.title}
                year={project.year ?? ""}
                image={storageUrl(project.card_image || project.hero_image)}
                alt={project.title}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
