import type { ReactNode } from "react";
import MaterialIcon from "./MaterialIcon";

interface ButtonProps {
  variant?: "primary" | "secondary";
  href?: string;
  icon?: string;
  className?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  href,
  icon,
  className = "",
  target,
  rel,
  type = "button",
  onClick,
  children,
}: ButtonProps) {
  const classes = `btn ${variant === "secondary" ? "btn--secondary" : "btn--primary"} ${className}`;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {children}
        {icon && <MaterialIcon name={icon} className="!text-xl" />}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
      {icon && <MaterialIcon name={icon} className="!text-xl" />}
    </button>
  );
}
