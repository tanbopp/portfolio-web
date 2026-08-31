import Hero from "@/components/Hero";
import Container from "@/components/Container";
import Stat from "@/components/Stat";
import SectionHeading from "@/components/SectionHeading";
import WorkItem from "@/components/WorkItem";
import ProductPanel from "@/components/ProductPanel";
import Button from "@/components/Button";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import { getPublishedProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getPublishedProjects();

  return (
    <>
      <Hero />

      <section className="w-full py-20">
        <Container className="grid grid-cols-1 md:grid-cols-5 gap-16">
          <div className="col-span-3 flex flex-col sm:justify-between">
            <p className="text-2xl sm:text-4xl max-w-2xl leading-[130%]">
              I build AI automation and custom software that cut manual work and help businesses
              run more efficiently—systems that solve real problems, not just look impressive.
            </p>
            <div className="flex flex-wrap gap-x-10 sm:gap-x-12 gap-y-8 mt-12 sm:mt-16">
              <Stat value="3+" label="Years of experience" />
              <Stat value="4" label="Companies" />
              <Stat value={`${projects.length}+`} label="Projects" />
            </div>
          </div>
          <div className="col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/tanbopp-photo.png" className="w-full grayscale" alt="Tanbopp" />
          </div>
        </Container>
      </section>

      <section className="w-full bg-black py-20">
        <Container>
          <SectionHeading className="text-4xl sm:text-5xl mb-16">Where I&apos;ve worked</SectionHeading>

          <WorkItem
            company="Otoproject Group"
            role="Graphic Designer"
            description1="Responsible for end-to-end vehicle catalog production—from product photography (DSLR & studio lighting) and photo editing to layout design and visual design for automotive marketplace platforms aligned with brand identity, including 3D product modeling for design presentation."
            description2="Designed packaging from product measurement, dieline creation, and layout to mockups, while coordinating with production teams and printing vendors to ensure print results matched the final design."
          />

          <WorkItem
            company="Centrova"
            role="Founder & Software Developer"
            description1="My role at Centrova focuses on building and growing the business, designing strategy, directing products and services, and ensuring technology solutions deliver real impact for customers."
          />
        </Container>
      </section>

      <ProjectsCarousel projects={projects} />

      {/* Feature Banner (full-bleed) */}
      <section className="relative w-full min-h-[70vh] flex items-center overflow-hidden border-t border-neutral-800/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop"
          alt="Futuristic facility"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/10" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <SectionHeading className="text-4xl sm:text-5xl md:text-6xl leading-[110%]">
              A system built for
              <br />
              scale and orbit
            </SectionHeading>
            <p className="mt-6 text-base sm:text-lg text-neutral-200/90 leading-relaxed">
              Combining logic, automation, and seamless integration — all under one roof.
            </p>
            <Button href="#" variant="primary" icon="chevron_right" className="mt-10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="w-full bg-black py-20">
        <Container>
          <SectionHeading className="text-3xl sm:text-5xl leading-[130%] mb-12 max-w-xl">
            Producing chips for use on Earth and in space
          </SectionHeading>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8">
            <ProductPanel name="AI5" image="https://terafab.ai/assets/chips/Chip_AI5.png" caption="Powering FSD & Tesla Optimus" />
            <ProductPanel name="AI6" image="https://terafab.ai/assets/chips/Chip_AI6.png" caption="Powering Tesla Optimus" />
            <ProductPanel name="D3" image="https://terafab.ai/assets/chips/Chip_D3.jpg" caption="Powering Space" />
            <ProductPanel name="...and Beyond" image="https://terafab.ai/assets/chips/Chip_Beyond.png" bordered={false} />
          </div>
        </Container>
      </section>
    </>
  );
}
