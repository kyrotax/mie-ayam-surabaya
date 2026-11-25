import { type ReactNode } from "react";

interface ButtonPrimaryProps {
  href: string;
  children: ReactNode;
  ariaLabel?: string;
  external?: boolean;
  className?: string;
}

export default function ButtonPrimary({
  href,
  children,
  ariaLabel,
  external = false,
  className = "",
}: ButtonPrimaryProps) {
  const baseClass = `btn-red-gold text-sm uppercase tracking-wider px-6 py-3 ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={baseClass}
      >
        {children}
      </a>
    );
  }

  return (
    <a href={href} aria-label={ariaLabel} className={baseClass}>
      {children}
    </a>
  );
}
