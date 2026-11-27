"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

interface ParallaxProps {
  children: ReactNode;
  /** Speed coefficient, e.g. 0.1 for gentle parallax, -0.1 for reverse */
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Parallax({
  children,
  speed = 0.1,
  className = "",
  style = {},
}: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const el = containerRef.current;
          if (el) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            // Only calculate when element is in or near viewport
            if (rect.top < windowHeight + 100 && rect.bottom > -100) {
              const elementCenter = rect.top + rect.height / 2;
              const viewportCenter = windowHeight / 2;
              const distanceFromCenter = elementCenter - viewportCenter;
              setOffset(distanceFromCenter * speed);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [speed]);

  const overflowClass = className.includes("overflow-") ? "" : "overflow-hidden";

  return (
    <div ref={containerRef} className={`relative ${overflowClass} ${className}`} style={style}>
      <div
        style={{
          transform: `translate3d(0, ${offset.toFixed(1)}px, 0)`,
          willChange: "transform",
          transition: "transform 0.1s ease-out",
        }}
        className="w-full h-full"
      >
        {children}
      </div>
    </div>
  );
}
