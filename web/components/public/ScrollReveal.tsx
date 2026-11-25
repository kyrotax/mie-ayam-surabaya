"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

type AnimationType = "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale" | "fade" | "fade-up" | "slide-up" | "fade-in";

interface ScrollRevealProps {
  children: ReactNode;
  /**
   * Animation style:
   * - "slideUp"    : fade + translateY(32px→0)  [default, matches e-cycle style]
   * - "fadeIn"     : pure opacity fade
   * - "slideLeft"  : fade + translateX(-32px→0)
   * - "slideRight" : fade + translateX(32px→0)
   * - "scale"      : fade + scale(0.93→1)
   * - "fade"/"fade-in"/"fade-up"/"slide-up" : accepted aliases
   */
  animation?: AnimationType;
  /** Delay in ms (e.g. 0, 100, 200) or seconds < 10 (e.g. 0.1, 0.2) */
  delay?: number;
  /** Duration in ms. Default: 600 */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

// Initial (hidden) state per animation type
const hiddenStyles: Record<string, CSSProperties> = {
  fadeIn: { opacity: 0 },
  slideUp: { opacity: 0, transform: "translateY(40px)" },
  slideLeft: { opacity: 0, transform: "translateX(-40px)" },
  slideRight: { opacity: 0, transform: "translateX(40px)" },
  scale: { opacity: 0, transform: "scale(0.93)" },
};

// Final (visible) state matching transform types explicitly for smooth hardware-accelerated interpolation
const visibleStyles: Record<string, CSSProperties> = {
  fadeIn: { opacity: 1 },
  slideUp: { opacity: 1, transform: "translateY(0px)" },
  slideLeft: { opacity: 1, transform: "translateX(0px)" },
  slideRight: { opacity: 1, transform: "translateX(0px)" },
  scale: { opacity: 1, transform: "scale(1)" },
};

/** Normalize any accepted alias to the canonical key in hiddenStyles */
function resolveAnimation(anim: AnimationType): keyof typeof hiddenStyles {
  switch (anim) {
    case "fade":
    case "fade-in":
    case "fadeIn":
      return "fadeIn";
    case "fade-up":
    case "slide-up":
    case "slideUp":
      return "slideUp";
    case "slideLeft": return "slideLeft";
    case "slideRight": return "slideRight";
    case "scale": return "scale";
    default: return "slideUp";
  }
}

export default function ScrollReveal({
  children,
  animation = "slideUp",
  delay = 0,
  duration = 600,
  className = "",
  style = {},
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver | null = null;

    // requestAnimationFrame ensures the browser has painted the initial hidden frame
    // before the observer triggers, preventing fast-hydration skips
    const rafId = requestAnimationFrame(() => {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            setVisible(true);
            if (observer && el) {
              observer.unobserve(el);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );

      observer.observe(el);
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // Convert delay: if < 10 treat as seconds, else treat as ms
  const delayMs = delay > 0 && delay < 10 ? delay * 1000 : delay;

  const key = resolveAnimation(animation);
  const currentStyle: CSSProperties = visible
    ? (visibleStyles[key] ?? visibleStyles.slideUp)
    : (hiddenStyles[key] ?? hiddenStyles.slideUp);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
        willChange: "opacity, transform",
        ...currentStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
