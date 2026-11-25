import Image from "next/image";
import { siteConfig } from "@/data/site.config";
import { MapPin, Phone, Instagram, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#6B1515] text-[#F5E6D3]" aria-label="Footer Mie Ayam Surabaya">
      <div className="border-t border-white/10" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
          {/* Kolom 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#F5E6D3]/40 shrink-0 bg-stone-50">
                <Image
                  src="/images/logo.jpg"
                  alt={`Logo ${siteConfig.brandName}`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-white uppercase leading-tight">
                  {siteConfig.brandName}
                </p>
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#F5E6D3]/60 font-semibold">
                  Autentik Oriental
                </p>
              </div>
            </div>

            <p className="text-sm text-[#F5E6D3]/80 leading-relaxed font-sans">
              {siteConfig.tagline}
            </p>

            <p className="text-xs text-[#F5E6D3]/60 font-sans leading-relaxed">
              Semangkuk mie kenyal buatan sendiri tiap pagi, disajikan hangat dengan bumbu ayam gurih meresap, kuah kaldu sapi, dan aneka minuman segar di Sidoarjo.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat (Pengganti Jam Buka) */}
          <div className="space-y-4">
            <h3 className="text-[11px] tracking-[0.2em] uppercase text-[#F5E6D3]/70 font-bold">
              Navigasi Halaman
            </h3>

            <ul className="space-y-2.5 font-sans text-xs">
              {[
                { label: "Beranda Utama", href: "#beranda" },
                { label: "Cerita & Tentang Kami", href: "#tentang" },
                { label: "Daftar Menu & Minuman", href: "#menu" },
                { label: "Kelebihan Warung", href: "#kenapa-kami" },
                { label: "Galeri Hidangan", href: "#galeri" },
                { label: "Petunjuk Arah & Lokasi", href: "#lokasi" },
              ].map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    className="text-white/80 hover:text-white transition-colors inline-block py-0.5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak, Alamat & Sosmed */}
          <div className="space-y-4">
            <h3 className="text-[11px] tracking-[0.2em] uppercase text-[#F5E6D3]/70 font-bold">
              Kontak & Lokasi
            </h3>

            <div className="space-y-3 font-sans text-xs sm:text-sm">
              <a
                href={siteConfig.kontak.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buka peta lokasi: ${siteConfig.kontak.alamat}`}
                className="flex items-start gap-2.5 text-[#F5E6D3]/80 hover:text-white transition-colors group"
              >
                <MapPin className="w-4 h-4 text-[#F5E6D3]/50 group-hover:text-[#F5E6D3] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-xs leading-relaxed">{siteConfig.kontak.alamat}</span>
              </a>

              <a
                href={`https://wa.me/${siteConfig.kontak.wa}?text=Halo%20${encodeURIComponent(
                  siteConfig.brandName
                )}%2C%20saya%20ingin%20memesan.`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${siteConfig.kontak.waDisplay} (buka di tab baru)`}
                className="flex items-center gap-2.5 text-[#F5E6D3]/80 hover:text-white transition-colors group"
              >
                <Phone className="w-4 h-4 text-[#F5E6D3]/50 group-hover:text-[#F5E6D3] shrink-0" aria-hidden="true" />
                <span className="font-semibold text-xs">{siteConfig.kontak.waDisplay}</span>
                <ExternalLink className="w-3 h-3 text-[#F5E6D3]/40 group-hover:text-[#F5E6D3]" aria-hidden="true" />
              </a>

              <a
                href={siteConfig.sosmed.igUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${siteConfig.sosmed.ig} (buka di tab baru)`}
                className="flex items-center gap-2.5 text-[#F5E6D3]/80 hover:text-white transition-colors group"
              >
                <Instagram className="w-4 h-4 text-[#F5E6D3]/50 group-hover:text-[#F5E6D3] shrink-0" aria-hidden="true" />
                <span className="font-semibold text-xs">{siteConfig.sosmed.ig}</span>
                <ExternalLink className="w-3 h-3 text-[#F5E6D3]/40 group-hover:text-[#F5E6D3]" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F5E6D3]/50 font-sans">
          <p>&copy; {new Date().getFullYear()} {siteConfig.brandName}. Hak cipta dilindungi.</p>
          <span className="text-[10px] tracking-widest uppercase text-[#F5E6D3]/40 font-semibold">
            Warung Kuliner Oriental Sidoarjo
          </span>
        </div>
      </div>
    </footer>
  );
}
