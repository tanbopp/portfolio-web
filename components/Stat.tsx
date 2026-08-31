export default function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <span className="text-5xl sm:text-6xl font-thin">{value}</span>
      <p className="tracking-wide mt-4 text-neutral-400">{label}</p>
    </div>
  );
}
