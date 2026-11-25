import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site.config";
import { MapPin, Phone, Instagram, ExternalLink } from "lucide-react";
import { ChineseBorderStrip } from "./ChineseOrnaments";

export default function Footer() {
  return (
    <footer className="bg-[#6B0000] text-[#FFF8E7]" aria-label="Footer Mie Ayam Surabaya">
      <ChineseBorderStrip />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Kolom 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] shrink-0 bg-[#8B0000]">
                <Image
                  src="/images/logo-umkm.jpg"
                  alt={`Logo ${siteConfig.brandName}`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="font-heading text-xl font-bold text-[#FFD700] leading-tight">
                  {siteConfig.brandName}
                </p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#FFF8E7]/80 font-medium font-sans">
                  Oriental Noodle House
                </p>
              </div>
            </div>

            <p className="text-sm text-[#FFF8E7]/90 leading-relaxed font-sans">
              {siteConfig.tagline}
            </p>

            <p className="text-xs text-[#FFF8E7]/75 font-sans leading-relaxed">
              Semangkuk mie kenyal buatan sendiri tiap pagi, disajikan hangat dengan bumbu ayam gurih meresap, kuah kaldu sapi, dan aneka minuman segar.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="space-y-4">
            <h3 className="font-display text-sm tracking-[0.18em] uppercase text-[#FFD700] font-bold">
              Navigasi Halaman
            </h3>

            <ul className="space-y-2.5 font-sans text-sm">
              {[
                { label: "Beranda Utama", href: "/#beranda" },
                { label: "Daftar Menu Lengkap", href: "/menu" },
                { label: "Tentang Kami", href: "/tentang" },
                { label: "Jam Buka & Lokasi", href: "/#lokasi" },
                { label: "Terima Pesanan", href: "/#kontak" },
                { label: "Portal Admin & Kasir", href: "/admin/login" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-gold-underline text-[#FFF8E7]/90 hover:text-[#FFD700] transition-colors inline-block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak, Alamat & Sosmed */}
          <div className="space-y-4">
            <h3 className="font-display text-sm tracking-[0.18em] uppercase text-[#FFD700] font-bold">
              Kontak & Lokasi
            </h3>

            <div className="space-y-3.5 font-sans text-xs sm:text-sm">
              <a
                href={siteConfig.kontak.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buka peta lokasi: ${siteConfig.kontak.alamat}`}
                className="flex items-start gap-2.5 text-[#FFF8E7]/90 hover:text-[#FFD700] transition-colors group"
              >
                <MapPin className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-xs leading-relaxed">{siteConfig.kontak.alamat}</span>
              </a>

              <a
                href={`https://wa.me/${siteConfig.kontak.wa}?text=Halo%20${encodeURIComponent(
                  siteConfig.brandName
                )}%2C%20saya%20ingin%20memesan.`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${siteConfig.kontak.waDisplay} (buka di tab baru)`}
                className="flex items-center gap-2.5 text-[#FFF8E7]/90 hover:text-[#FFD700] transition-colors group"
              >
                <Phone className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0" aria-hidden="true" />
                <span className="font-semibold text-xs">{siteConfig.kontak.waDisplay}</span>
                <ExternalLink className="w-3 h-3 text-[#D4AF37]/80 group-hover:text-[#FFD700]" aria-hidden="true" />
              </a>

              <a
                href={siteConfig.sosmed.igUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${siteConfig.sosmed.ig} (buka di tab baru)`}
                className="flex items-center gap-2.5 text-[#FFF8E7]/90 hover:text-[#FFD700] transition-colors group"
              >
                <Instagram className="w-4 h-4 text-[#D4AF37] group-hover:scale-125 group-hover:-rotate-6 transition-transform shrink-0" aria-hidden="true" />
                <span className="font-semibold text-xs">{siteConfig.sosmed.ig}</span>
                <ExternalLink className="w-3 h-3 text-[#D4AF37]/80 group-hover:text-[#FFD700]" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FFF8E7]/75 font-sans">
          <p>&copy; {new Date().getFullYear()} {siteConfig.brandName}. Hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="text-[#FFF8E7]/60 hover:text-[#FFD700] transition-colors"
            >
              Portal Admin
            </Link>
            <span className="text-[#D4AF37]/40">•</span>
            <span className="text-[11px] tracking-widest uppercase text-[#FFD700]/80 font-semibold">
              Warung Kuliner Oriental Sidoarjo
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
