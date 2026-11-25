"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site.config";
import { Menu, X, MessageCircle } from "lucide-react";

const NAV_LINKS = [
  { href: "#tentang", label: "Tentang" },
  { href: "#menu", label: "Menu" },
  { href: "#lokasi", label: "Lokasi" },
  { href: "#kontak", label: "Kontak" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const waLink = `https://wa.me/${siteConfig.kontak.wa}?text=Halo%20${encodeURIComponent(
    siteConfig.brandName
  )}%2C%20saya%20ingin%20memesan.`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm"
          : "py-4 bg-white/90 backdrop-blur-sm border-b border-stone-100"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <Link
          href="/"
          className="flex items-center gap-3 group shrink-0"
          aria-label={`Beranda ${siteConfig.brandName}`}
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#8B1E1E] shadow-sm shrink-0 bg-stone-50">
            <Image
              src="/images/logo.jpg"
              alt={`Logo ${siteConfig.brandName}`}
              fill
              className="object-cover"
              priority
              sizes="40px"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-stone-900 group-hover:text-[#8B1E1E] transition-colors uppercase leading-none">
              {siteConfig.brandName}
            </span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-stone-500 font-semibold mt-1 hidden sm:block">
              {siteConfig.copy.hero.eyebrow}
            </span>
          </div>
        </Link>

        {/* Desktop Single-Page Navigation */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Navigasi halaman">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-xs tracking-wider uppercase font-semibold text-stone-600 hover:text-[#8B1E1E] transition-colors duration-200 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pesan via WhatsApp (buka di tab baru)"
            className="inline-flex items-center gap-2 bg-[#8B1E1E] hover:bg-[#6B1515] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors duration-200 min-h-[40px] shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Pesan via WA</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 rounded-lg text-stone-700 hover:text-[#8B1E1E] hover:bg-stone-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1E1E] min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" aria-hidden="true" />
          ) : (
            <Menu className="w-6 h-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi mobile"
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-stone-200 shadow-lg"
        >
          <nav className="max-w-6xl mx-auto px-5 py-5 space-y-1" aria-label="Navigasi mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-stone-700 hover:text-[#8B1E1E] hover:bg-stone-50 rounded-lg transition-colors uppercase tracking-wide"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-stone-100 mt-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                aria-label="Pesan via WhatsApp (buka di tab baru)"
                className="flex items-center justify-center gap-2 bg-[#8B1E1E] text-white font-bold text-sm uppercase tracking-wider px-6 py-3.5 rounded-full w-full transition-colors hover:bg-[#6B1515] min-h-[48px]"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Pesan via WhatsApp</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
