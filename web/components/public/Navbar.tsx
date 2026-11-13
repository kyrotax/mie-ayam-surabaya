"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Daftar Menu" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/lokasi", label: "Lokasi & Jam Buka" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm"
          : "py-4 bg-white/90 backdrop-blur-sm border-b border-stone-100"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand Logo & Stamp */}
        <Link
          href="/"
          className="flex items-center gap-3 group shrink-0"
          aria-label="Beranda Mie Ayam Surabaya"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#BA382A] shadow-sm shrink-0 bg-stone-50">
            <Image
              src="/images/logo.jpg"
              alt="Logo Mie Ayam Surabaya"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-[#BA382A] transition-colors uppercase leading-none">
                Mie Ayam Surabaya
              </span>
              <span className="saigetsu-stamp hidden sm:inline-flex">東方</span>
            </div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-stone-500 font-semibold mt-0.5">
              Autentik Oriental · Sejak 2024
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs tracking-wider uppercase font-semibold transition-colors duration-200 py-1 ${
                  active
                    ? "text-[#BA382A]"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#BA382A] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://wa.me/6282319195854?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20memesan."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-saigetsu text-xs uppercase tracking-wider py-2.5 px-4 font-bold"
            aria-label="Pesan via WhatsApp (buka di tab baru)"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Pesan via WA</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 rounded-lg text-stone-700 hover:text-[#BA382A] hover:bg-stone-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA382A] min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white/98 backdrop-blur-md px-6 py-6 space-y-2 shadow-lg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-semibold tracking-wide uppercase border-b border-stone-100 transition-colors min-h-[44px] flex items-center ${
                pathname === link.href
                  ? "text-[#BA382A] font-bold"
                  : "text-stone-700 hover:text-[#BA382A]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <a
              href="https://wa.me/6282319195854?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20memesan."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="btn-saigetsu w-full justify-center text-xs uppercase tracking-wider py-3"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Pesan via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
