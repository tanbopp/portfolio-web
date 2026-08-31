import Link from "next/link";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop";

export default function ProjectCard({
  href,
  title,
  year,
  image,
  alt,
}: {
  href: string;
  title: string;
  year?: string;
  image?: string | null;
  alt: string;
}) {
  const src = image || FALLBACK_IMAGE;
  return (
    <Link
      href={href}
      className="group flex-shrink-0 w-[80vw] sm:w-[420px] md:w-[480px] snap-start cursor-pointer overflow-hidden rounded-md block"
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full aspect-video object-cover" loading="lazy" />
        <div className="absolute w-full bottom-0 group-hover:opacity-0 transition duration-300">
          <div className="h-28 bg-gradient-to-t from-black/85 to-transparent" />
        </div>
      </div>
      <div className="mt-5">
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-sm text-neutral-300 font-medium">{year}</p>
      </div>
    </Link>
  );
}
