"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryCarouselProps {
  items: GalleryPhoto[];
}

export default function GalleryCarousel({ items }: GalleryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < maxScroll - 10);

    if (maxScroll <= 10) {
      setTotalPages(1);
      setCurrentPage(0);
      return;
    }

    const step = el.clientWidth * 0.85;
    const pages = Math.max(2, Math.ceil(maxScroll / step) + 1);
    setTotalPages(pages);

    const ratio = Math.max(0, Math.min(1, el.scrollLeft / maxScroll));
    const active = Math.min(Math.round(ratio * (pages - 1)), pages - 1);
    setCurrentPage(active);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [items]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const step = totalPages > 1 ? maxScroll / (totalPages - 1) : el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const scrollToPage = (pageIdx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = totalPages > 1 ? (pageIdx / (totalPages - 1)) * maxScroll : 0;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <div className="w-full">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9A6B00]">
          <Camera className="w-4 h-4 text-[#8B0000]" aria-hidden="true" />
          <span>Suasana & Sajian Warung</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            aria-label="Geser galeri ke kiri"
            className="w-10 h-10 rounded-full border border-stone-300 bg-white hover:border-[#D4AF37] hover:bg-[#FAF7F2] text-[#2C1810] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            aria-label="Geser galeri ke kanan"
            className="w-10 h-10 rounded-full border border-stone-300 bg-white hover:border-[#D4AF37] hover:bg-[#FAF7F2] text-[#2C1810] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Swipeable Track with CSS Scroll-Snap */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 focus:outline-none [-webkit-overflow-scrolling:touch]"
        style={{ scrollbarWidth: "none" }}
        tabIndex={0}
        aria-label="Galeri foto warung"
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="snap-start shrink-0 w-[78vw] sm:w-[45vw] lg:w-[320px] group"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-sm group-hover:border-[#D4AF37] group-hover:-translate-y-[6px] group-hover:shadow-2xl transition-all duration-300 ease-out">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 320px"
              />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-xs font-semibold">
                  {item.caption}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators: Synchronized with actual navigable pages */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6" aria-hidden="true">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToPage(idx)}
              aria-label={`Lihat slide ${idx + 1} dari ${totalPages}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentPage === idx
                  ? "w-8 bg-[#8B0000]"
                  : "w-2 bg-stone-300 hover:bg-[#D4AF37]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

