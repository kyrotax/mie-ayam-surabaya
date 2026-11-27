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
    <header className="sticky top-0 z-40 h-16 border-b border-[#E3DDD6] bg-[#FAF9F7]/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-5">
        {/* Left: Logo + Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D0D00] rounded-[10px]"
          aria-label={`Beranda ${siteData.brandName}`}
        >
          <div className="relative h-9 w-9 rounded-[10px] overflow-hidden border border-[#DCD5CD] bg-white shrink-0">
            <Image
              src="/images/logo-umkm.jpg"
              alt={`Logo ${siteData.brandName}`}
              fill
              className="object-cover"
              priority
              sizes="36px"
            />
          </div>
          <span className="text-sm sm:text-base font-semibold tracking-[-0.02em] text-[#251C17]">
            {siteData.brandName}
          </span>
        </Link>

        {/* Center (>=md): Anchor links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Navigasi halaman">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#443831] hover:text-[#8D0D00] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D0D00] rounded px-1 py-0.5"
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
            className="hidden lg:inline-flex"
          />

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pesan via WhatsApp (buka di tab baru)"
            className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#8D0D00] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#6F0A00] transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D0D00] focus-visible:ring-offset-2"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Pesan via WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#DCD5CD] bg-white text-[#251C17] hover:bg-[#F4F0EB] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D0D00]"
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
          className="md:hidden absolute top-full left-0 right-0 border-b border-[#DCD5CD] bg-[#FAF9F7] shadow-lg"
        >
          <nav className="mx-auto max-w-6xl px-5 py-4 space-y-1" aria-label="Navigasi mobile">
            <div className="pb-3 mb-2 border-b border-[#E3DDD6]">
              <StatusBadge
                isOpen={siteData.statusBuka}
                note={siteData.statusBukaNote}
              />
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-[10px] px-3 py-2.5 text-sm font-medium text-[#251C17] hover:bg-[#F4F0EB] hover:text-[#8D0D00] transition-colors min-h-[44px]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-[#E3DDD6] flex items-center justify-between gap-3">
              <Link
                href="/menu"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-[#443831] hover:text-[#8D0D00] py-2"
              >
                Daftar Menu Lengkap
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="text-xs font-semibold text-[#6E6259] hover:text-[#251C17] py-2"
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
