// ButtonOutline: pill, border merah bata, transparent bg
import { type ReactNode } from "react";

interface ButtonOutlineProps {
  href: string;
  children: ReactNode;
  ariaLabel?: string;
  external?: boolean;
  light?: boolean; // white border untuk background merah
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
    ? `inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 ${className}`
    : `inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#8B1E1E] text-[#8B1E1E] hover:text-white border-2 border-[#8B1E1E] font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8B1E1E] focus-visible:outline-offset-2 ${className}`;

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

