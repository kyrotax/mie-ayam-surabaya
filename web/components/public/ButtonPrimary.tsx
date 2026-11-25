// ButtonPrimary: pill, merah bata, hover darker
// Wrapper fleksibel untuk <a> dan <Link>
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
  const baseClass = `inline-flex items-center justify-center gap-2 bg-[#8B1E1E] hover:bg-[#6B1515] text-white font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 ${className}`;

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

