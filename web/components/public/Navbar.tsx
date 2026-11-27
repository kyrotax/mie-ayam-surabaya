"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLiveData } from "@/lib/public/LiveDataContext";
import StatusBadge from "./StatusBadge";
import { Menu, X, MessageCircle } from "lucide-react";

const NAV_LINKS = [
  { href: "/#tentang", label: "Tentang" },
  { href: "/#menu", label: "Menu" },
  { href: "/#galeri", label: "Galeri" },
  { href: "/#cara-pesan", label: "Cara Pesan" },
  { href: "/#lokasi", label: "Lokasi" },
];

export default function Navbar() {
  const { siteData } = useLiveData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const waLink = `https://wa.me/${siteData.kontak.wa}?text=${encodeURIComponent(
    `Halo ${siteData.brandName}, saya ingin memesan.`
  )}`;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 text-white ${isScrolled
        ? "bg-gradient-to-r from-[#B80809]/90 via-[#D10B0C]/90 to-[#B80809]/90 backdrop-blur-md border-b border-[#9E0607]/80 shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
        : "bg-gradient-to-r from-[#B80809] via-[#D10B0C] to-[#B80809] border-b border-[#9E0607] shadow-sm shadow-[#D10B0C]/15"
        }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        {/* Left: Logo (Bulat) + Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
          aria-label={`Beranda ${siteData.brandName}`}
        >
          <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white/90 bg-white shadow-md shrink-0 ring-2 ring-black/10">
            <Image
              src="/images/logo-umkm.jpg"
              alt={`Logo ${siteData.brandName}`}
              fill
              className="object-cover"
              priority
              sizes="40px"
            />
          </div>
          <span className="text-base sm:text-lg font-extrabold tracking-[-0.02em] text-white drop-shadow-xs">
            {siteData.brandName}
          </span>
        </Link>

        {/* Center (>=md): Anchor links */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3" aria-label="Navigasi halaman">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-white/90 hover:text-white hover:bg-white/15 transition-all rounded-lg px-2.5 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: StatusBadge + WhatsAppButton */}
        <div className="flex items-center gap-2.5">
          <StatusBadge
            isOpen={siteData.statusBuka}
            note={siteData.statusBuka ? "13.00–Habis" : "Tutup"}
            theme="onRed"
            className="hidden lg:inline-flex"
          />

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pesan via WhatsApp (buka di tab baru)"
            className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[#D10B0C] shadow-md shadow-black/15 hover:bg-[#FFF5F5] hover:scale-[1.02] transition-all min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#D10B0C]"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Pesan via WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi mobile"
          className="md:hidden absolute top-full left-0 right-0 border-b border-[#9E0607] bg-[#B80809] shadow-2xl text-white"
        >
          <nav className="mx-auto max-w-6xl px-5 py-4 space-y-1" aria-label="Navigasi mobile">
            <div className="pb-3 mb-2 border-b border-white/15">
              <StatusBadge
                isOpen={siteData.statusBuka}
                note={siteData.statusBukaNote}
                theme="onRed"
              />
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-[10px] px-3 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/15 hover:text-white transition-colors min-h-[44px]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-white/15 flex items-center justify-between gap-3">
              <Link
                href="/menu"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-white/90 hover:text-white py-2"
              >
                Daftar Menu Lengkap
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="text-xs font-medium text-white/70 hover:text-white py-2"
              >
                Portal Admin
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
