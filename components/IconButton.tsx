import MaterialIcon from "./MaterialIcon";

export default function IconButton({
  icon,
  ariaLabel,
  onClick,
  id,
}: {
  icon: string;
  ariaLabel?: string;
  onClick?: () => void;
  id?: string;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      aria-label={ariaLabel}
      className="w-12 h-12 flex items-center justify-center bg-neutral-950 hover:bg-neutral-900 rounded-md transition duration-300"
    >
      <MaterialIcon name={icon} className="text-[24px] text-neutral-300" />
    </button>
  );
}
