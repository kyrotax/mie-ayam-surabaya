"use client";

import { useEffect, useRef, useState } from "react";
import { formatRupiah } from "@/lib/utils";

interface PriceCounterProps {
  value: number;
  className?: string;
}

/**
 * Animasi counter harga halus saat elemen masuk viewport.
 */
export default function PriceCounter({ value, className = "" }: PriceCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.unobserve(el);

          const duration = 600;
          const startTime = performance.now();
          const startValue = Math.max(0, Math.floor(value * 0.5));

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startValue + (value - startValue) * eased);
            setDisplayValue(current);
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className} aria-label={formatRupiah(value)}>
      {formatRupiah(displayValue)}
    </span>
  );
}
