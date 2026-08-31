import type { ReactNode } from "react";

export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-6xl mx-auto px-4 sm:px-8 ${className ?? ""}`}>{children}</div>
  );
}
