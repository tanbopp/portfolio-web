export default function ProductPanel({
  name,
  image,
  caption,
  bordered = true,
}: {
  name: string;
  image: string;
  caption?: string;
  bordered?: boolean;
}) {
  return (
    <div className="group">
      <div className="overflow-hidden aspect-[3/4] bg-neutral-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="mt-5">
        <span
          className={
            bordered
              ? "text-base font-semibold text-white border-[0.5px] border-neutral-700 px-1.5 rounded"
              : "text-base font-semibold text-white"
          }
        >
          {name}
        </span>
        {caption && <p className="mt-1 text-neutral-500 leading-relaxed text-sm sm:text-base">{caption}</p>}
      </div>
    </div>
  );
}
