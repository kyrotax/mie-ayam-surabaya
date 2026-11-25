"use client";

import { useEffect, useRef, useState } from "react";

interface DividerProps {
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Chinese Knot Divider dengan garis elegan dan motif simpul tradisional halus.
 */
export function ChineseKnotDivider({ variant = "dark", className = "" }: DividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const lineColor = variant === "light" ? "rgba(255, 215, 0, 0.45)" : "rgba(212, 175, 55, 0.65)";
  const knotStroke = variant === "light" ? "#FFD700" : "#C41E3A";
  const knotAccent = "#D4AF37";

  return (
    <div
      ref={ref}
      className={`flex items-center justify-center gap-3 w-full max-w-xs mx-auto my-3 ${className}`}
      aria-hidden="true"
    >
      <div
        className="h-[1px] flex-1 transition-all duration-700 ease-out origin-right"
        style={{
          background: `linear-gradient(to left, ${lineColor}, transparent)`,
          transform: drawn ? "scaleX(1)" : "scaleX(0)",
        }}
      />
      <div className="w-2 h-2 rotate-45 border border-[#D4AF37] bg-[#8B0000] shrink-0" />
      <div
        className="h-[1px] flex-1 transition-all duration-700 ease-out origin-left"
        style={{
          background: `linear-gradient(to right, ${lineColor}, transparent)`,
          transform: drawn ? "scaleX(1)" : "scaleX(0)",
        }}
      />
    </div>
  );
}

/**
 * Pattern border geometris Chinese halus untuk header/footer.
 */
export function ChineseBorderStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full h-2 overflow-hidden opacity-80 ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='8' viewBox='0 0 32 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4h6V1h8v6h4V1h8v4h6' fill='none' stroke='%23D4AF37' stroke-width='1.2'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat-x",
      }}
      aria-hidden="true"
    />
  );
}

