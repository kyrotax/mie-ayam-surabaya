"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestimonialCard from "./TestimonialCard";
import { TestimoniItem } from "@/types/site";

interface TestimonialCarouselProps {
  testimoni: TestimoniItem[];
  mapsUrl: string;
}

export default function TestimonialCarousel({
  testimoni,
  mapsUrl,
}: TestimonialCarouselProps) {
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
  }, [testimoni]);

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
      {/* Top Controls: Arrow Navigation */}
      <div className="flex items-center justify-end gap-2 mb-6">
        <button
          type="button"
          onClick={() => scrollByAmount("left")}
          disabled={!canScrollLeft}
          aria-label="Geser testimoni ke kiri"
          className="w-10 h-10 rounded-full border border-stone-300 bg-white hover:border-[#D4AF37] hover:bg-[#FAF7F2] text-[#2C1810] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollByAmount("right")}
          disabled={!canScrollRight}
          aria-label="Geser testimoni ke kanan"
          className="w-10 h-10 rounded-full border border-stone-300 bg-white hover:border-[#D4AF37] hover:bg-[#FAF7F2] text-[#2C1810] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Swipeable Track with CSS Scroll-Snap */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 focus:outline-none [-webkit-overflow-scrolling:touch]"
        style={{ scrollbarWidth: "none" }}
        tabIndex={0}
        aria-label="Daftar testimoni pelanggan"
      >
        {testimoni.map((t, idx) => (
          <div
            key={idx}
            className="snap-start shrink-0 w-[86vw] sm:w-[48vw] lg:w-[420px]"
          >
            <TestimonialCard
              nama={t.nama}
              teks={t.teks}
              rating={t.rating}
              asal={t.asal}
              mapsUrl={mapsUrl}
            />
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
              aria-label={`Lihat testimoni halaman ${idx + 1} dari ${totalPages}`}
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

