import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Instagram, Clock, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#FAF8F5] border-t border-stone-200 pt-16 pb-12 px-5 sm:px-8 text-stone-700">
      <div className="max-w-6xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-200">
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#BA382A] shadow-sm shrink-0 bg-white">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo Mie Ayam Surabaya"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-2xl font-bold tracking-tight text-stone-900 uppercase leading-none">
                    Mie Ayam Surabaya
                  </span>
                  <span className="saigetsu-stamp">東方</span>
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-stone-500 font-semibold mt-0.5">
                  Autentik Oriental · Sejak 2024
                </p>
              </div>
            </div>
            <p className="text-sm text-stone-600 font-sans leading-relaxed max-w-sm">
              Menyajikan mie ayam oriental dengan tekstur kenyal, bumbu gurih meresap, dan topping pilihan melimpah. Warung kuliner keluarga di Sidoarjo, Jawa Timur.
            </p>
          </div>

          {/* Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs tracking-[0.15em] uppercase text-[#BA382A] font-bold">
              Navigasi
            </p>
            <ul className="space-y-2 text-sm font-sans">
              {[
                { label: "Beranda", href: "/" },
                { label: "Daftar Menu", href: "/menu" },
                { label: "Tentang Kami", href: "/tentang" },
                { label: "Lokasi & Jam", href: "/lokasi" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-stone-600 hover:text-[#BA382A] font-medium transition-colors py-1 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operating Hours (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs tracking-[0.15em] uppercase text-[#BA382A] font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#BA382A]" aria-hidden="true" />
              <span>Jam Buka</span>
            </p>
            <p className="text-sm text-stone-800 font-bold font-sans">
              Setiap Hari
            </p>
            <p className="text-sm font-display font-bold text-[#BA382A]">
              09.00 sampai 21.00 WIB
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Makan di tempat, bawa pulang, dan pesanan WhatsApp / Gojek.
            </p>
          </div>

          {/* Contact & Address (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs tracking-[0.15em] uppercase text-[#BA382A] font-bold">
              Kontak & Alamat
            </p>
            <div className="space-y-2.5 text-sm font-sans">
              <div className="flex items-start gap-2.5 text-stone-600">
                <MapPin className="w-4 h-4 text-[#BA382A] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-xs leading-relaxed">
                  Taman Pinang Indah, Sidoarjo, Jawa Timur
                </span>
              </div>
              <a
                href="https://wa.me/6282319195854"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-stone-700 hover:text-[#BA382A] transition-colors group"
                aria-label="Nomor WhatsApp 0823-1919-5854 (buka di tab baru)"
              >
                <Phone className="w-4 h-4 text-[#BA382A] shrink-0" aria-hidden="true" />
                <span className="font-semibold text-xs">0823-1919-5854</span>
                <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-[#BA382A]" aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com/mieayamsurabaya_/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-stone-700 hover:text-[#BA382A] transition-colors group"
                aria-label="Instagram @mieayamsurabaya_ (buka di tab baru)"
              >
                <Instagram className="w-4 h-4 text-[#BA382A] shrink-0" aria-hidden="true" />
                <span className="font-semibold text-xs">@mieayamsurabaya_</span>
                <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-[#BA382A]" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 font-sans">
          <p>© {new Date().getFullYear()} Mie Ayam Surabaya. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] tracking-wider uppercase text-stone-400 font-semibold">
              UMKM Kuliner Oriental Sidoarjo
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
