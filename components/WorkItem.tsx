export default function WorkItem({
  company,
  role,
  description1,
  description2,
}: {
  company: string;
  role: string;
  description1: string;
  description2?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-16 py-6 border-t border-neutral-800/60">
      <div className="flex flex-col gap-3">
        <span className="text-xl sm:text-2xl font-semibold text-white">{company}</span>
        <p className="text-base text-neutral-400 font-medium">{role}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 tracking-wide">
        <p className="text-neutral-400 leading-relaxed max-w-2xl mb-5">{description1}</p>
        {description2 && (
          <p className="text-neutral-400 leading-relaxed max-w-2xl mb-5">{description2}</p>
        )}
      </div>
    </div>
  );
}
