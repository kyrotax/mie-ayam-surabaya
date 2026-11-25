"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLiveData } from "@/lib/public/LiveDataContext";
import { Menu, X, MessageCircle } from "lucide-react";

const NAV_LINKS = [
  { href: "/#beranda", label: "Beranda" },
  { href: "/#menu", label: "Menu" },
  { href: "/#tentang", label: "Tentang Kami" },
  { href: "/#lokasi", label: "Lokasi" },
  { href: "/#kontak", label: "Kontak" },
];

export default function Navbar() {
  const { siteData } = useLiveData();
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

  const waLink = `https://wa.me/${siteData.kontak.wa}?text=Halo%20${encodeURIComponent(
    siteData.brandName
  )}%2C%20saya%20ingin%20memesan.`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-2 bg-[#8B0000]/75 backdrop-blur-sm border-b border-[#D4AF37]/30 shadow-md"
          : "py-3.5 bg-[#8B0000] border-b border-[#D4AF37]/20"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo Ayam-Mie & Title */}
        <Link
          href="/"
          className="flex items-center gap-3 group shrink-0"
          aria-label={`Beranda ${siteData.brandName}`}
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-sm shrink-0 bg-[#6B0000] group-hover:border-[#FFD700] transition-colors">
            <Image
              src="/images/logo-umkm.jpg"
              alt={`Logo ${siteData.brandName}`}
              fill
              className="object-cover"
              priority
              sizes="44px"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-base sm:text-xl font-bold tracking-tight text-[#FFD700] group-hover:text-white transition-colors leading-none">
              {siteData.brandName}
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#FFF8E7]/80 font-medium mt-1 hidden sm:block">
              Oriental Noodle House
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7" aria-label="Navigasi halaman">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-gold-underline text-xs tracking-wider uppercase font-semibold text-[#FFF8E7] hover:text-[#FFD700] transition-colors duration-200 py-1.5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA Button (Gold) */}
        <div className="hidden md:flex items-center">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pesan sekarang via WhatsApp (buka di tab baru)"
            className="btn-gold text-xs uppercase tracking-wider px-5 py-2.5 min-h-[42px]"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Pesan Sekarang</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden px-3 py-2 rounded-xl text-[#FFD700] hover:bg-[#6B0000] border border-[#D4AF37]/40 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5"
          aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" aria-hidden="true" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wider">Menu</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi mobile"
          className="md:hidden absolute top-full left-0 right-0 bg-[#6B0000] border-b-2 border-[#D4AF37] shadow-xl"
        >
          <nav className="max-w-6xl mx-auto px-5 py-5 space-y-1.5" aria-label="Navigasi mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-[#FFF8E7] hover:text-[#FFD700] hover:bg-[#8B0000] rounded-xl transition-colors uppercase tracking-wide min-h-[44px]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#D4AF37]/30 mt-3 space-y-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                aria-label="Pesan sekarang via WhatsApp (buka di tab baru)"
                className="btn-gold w-full justify-center text-sm uppercase tracking-wider min-h-[48px]"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Pesan Sekarang</span>
              </a>
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#D4AF37]/30 text-xs font-semibold uppercase tracking-wider text-[#FFD700] hover:bg-[#8B0000] transition-colors"
              >
                <span>Portal Admin</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
