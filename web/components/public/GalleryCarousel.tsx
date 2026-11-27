"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Camera, ExternalLink } from "lucide-react";

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryCarouselProps {
  items: GalleryPhoto[];
  mapsGalleryUrl?: string;
}

const DEFAULT_MAPS_URL =
  "https://www.google.com/maps/place/MIE+AYAM+SURABAYA/@-7.4492413,112.7050814,15z/data=!4m15!1m8!3m7!1s0x2dd7e1704b5593cd:0x81c8774cf4076883!2sMIE+AYAM+SURABAYA!8m2!3d-7.4493338!4d112.7049644!10e9!16s%2Fg%2F11z9hk1f4y!3m5!1s0x2dd7e1704b5593cd:0x81c8774cf4076883!8m2!3d-7.4493338!4d112.7049644!16s%2Fg%2F11z9hk1f4y";

export default function GalleryCarousel({
  items,
  mapsGalleryUrl = DEFAULT_MAPS_URL,
}: GalleryCarouselProps) {
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
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
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
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8D0D00]">
          <Camera className="w-4 h-4 text-[#8D0D00]" aria-hidden="true" />
          <span>Dokumentasi Warung & Sajian</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            aria-label="Geser galeri ke kiri"
            className="w-10 h-10 rounded-[12px] border border-[#DCD5CD] bg-white hover:border-[#8D0D00] hover:text-[#8D0D00] text-[#251C17] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-xs"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            aria-label="Geser galeri ke kanan"
            className="w-10 h-10 rounded-[12px] border border-[#DCD5CD] bg-white hover:border-[#8D0D00] hover:text-[#8D0D00] text-[#251C17] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-xs"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Swipeable Track with CSS Scroll-Snap */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 focus:outline-none [-webkit-overflow-scrolling:touch]"
        style={{ scrollbarWidth: "none" }}
        tabIndex={0}
        aria-label="Galeri foto warung dan sajian mie ayam"
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="snap-start shrink-0 w-[82vw] sm:w-[48vw] lg:w-[340px] group"
          >
            <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-[#F8F5F2] border border-[#E8E2DC] shadow-[0_4px_16px_rgba(31,25,22,0.04)] group-hover:border-[#D10B0C]/40 group-hover:shadow-[0_12px_28px_rgba(209,11,12,0.08)] transition-all duration-300">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                loading="lazy"
                className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 48vw, 340px"
              />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-[#1E1612]/85 via-[#1E1612]/40 to-transparent text-white text-xs font-semibold backdrop-blur-[1px]">
                  {item.caption}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer controls & Google Maps Link */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-2">
        {/* Dot Indicators */}
        {totalPages > 1 ? (
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToPage(idx)}
                aria-label={`Lihat slide ${idx + 1} dari ${totalPages}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentPage === idx
                    ? "w-7 bg-gradient-to-r from-[#D10B0C] to-[#E52D2E]"
                    : "w-2 bg-[#E8E2DC] hover:bg-[#D10B0C]/40"
                }`}
              />
            ))}
          </div>
        ) : (
          <div />
        )}

        <a
          href={mapsGalleryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-[12px] bg-white border border-[#DCD5CD] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#251C17] hover:bg-[#F4F0EB] hover:text-[#8D0D00] transition-colors shadow-xs"
        >
          <span>Lihat Foto Lainnya di Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#8D0D00]" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
