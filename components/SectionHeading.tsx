import type { ReactNode } from "react";

export default function SectionHeading({
  as: Tag = "h2",
  children,
  className,
}: {
  as?: "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
}) {
  return (
    <Tag className={`font-thin tracking-[-2%] ${className ?? ""}`}>{children}</Tag>
  );
}
