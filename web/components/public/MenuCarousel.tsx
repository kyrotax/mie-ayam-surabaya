"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { MenuItem } from "@/types/site";
import MenuCard from "./MenuCard";

interface MenuCarouselProps {
  makanan: MenuItem[];
  minuman: MenuItem[];
  waNumber: string;
}

export default function MenuCarousel({ makanan, minuman, waNumber }: MenuCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // All items — no category filter tabs
  const items = [...makanan, ...minuman];

  // --- Dot indicator: track active card via IntersectionObserver per card ---
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most-visible card
        let maxRatio = 0;
        let idx = activeIndex;
        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            const i = els.indexOf(entry.target as HTMLDivElement);
            if (i !== -1) idx = i;
          }
        });
        setActiveIndex(idx);
      },
      {
        root: scrollRef.current,
        threshold: [0, 0.5, 1],
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  // --- Mouse drag to scroll (desktop) ---
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = scrollRef.current?.scrollLeft ?? 0;
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const dx = e.pageX - startX.current;
    scrollRef.current.scrollLeft = scrollStart.current - dx;
  }, []);

  const onMouseUpOrLeave = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }, []);

  return (
    <div className="w-full" aria-label="Menu carousel">
      {/* Swipeable / Draggable Scroll Track with CSS Scroll-Snap */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 pt-2 px-1 focus:outline-none select-none"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          cursor: "grab",
          msOverflowStyle: "none",
        } as React.CSSProperties}
        tabIndex={0}
        aria-label="Daftar menu carousel"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
      >

        {items.map((item, idx) => (
          <div
            key={item.id}
            ref={(el) => { cardRefs.current[idx] = el; }}
            className="snap-start shrink-0 w-[80vw] sm:w-[44vw] lg:w-[270px] xl:w-[280px] rounded-xl overflow-hidden"
          >
            <MenuCard
              name={item.nama}
              description={item.deskripsi}
              price={item.harga}
              imageUrl={item.foto}
              badge={item.badge}
              isAvailable={item.isAvailable ?? true}
              waNumber={waNumber}
            />
          </div>
        ))}
      </div>

      {/* Dot Indicators (display only, not clickable) */}
      <div
        className="flex items-center justify-center gap-2 mt-3"
        aria-hidden="true"
        role="presentation"
      >
        {items.map((_, idx) => (
          <span
            key={idx}
            className={`block rounded-full transition-all duration-300 ease-out ${
              activeIndex === idx
                ? "w-6 h-2 bg-[#8B0000]"
                : "w-2 h-2 bg-stone-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
