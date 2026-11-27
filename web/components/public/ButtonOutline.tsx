import { type ReactNode } from "react";

interface ButtonOutlineProps {
  href: string;
  children: ReactNode;
  ariaLabel?: string;
  external?: boolean;
  light?: boolean;
  className?: string;
}

export default function ButtonOutline({
  href,
  children,
  ariaLabel,
  external = false,
  light = false,
  className = "",
}: ButtonOutlineProps) {
  const baseClass = light
    ? `inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#FFD700]/15 text-[#FFD700] border-2 border-[#D4AF37] font-semibold text-sm uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 min-h-[44px] ${className}`
    : `inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#8B0000] text-[#8B0000] hover:text-[#FFD700] border-2 border-[#8B0000] font-semibold text-sm uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 min-h-[44px] ${className}`;

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
