"use client";

import Image from "next/image";
import Link from "next/link";
import { useLiveData } from "@/lib/public/LiveDataContext";
import { MapPin, Phone, Instagram, Clock } from "lucide-react";

export default function Footer() {
  const { siteData } = useLiveData();

  return (
    <footer className="bg-[#1E1612] text-[#E3DDD6]" aria-label="Footer Mie Ayam Surabaya">
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#34261F]">
          {/* Kolom 1: Logo + deskripsi 1 kalimat */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border border-[#483329] bg-[#251C17] shrink-0 ring-1 ring-white/10">
                <Image
                  src="/images/logo-umkm.jpg"
                  alt={`Logo ${siteData.brandName}`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <span className="text-base font-semibold text-white tracking-[-0.02em]">
                {siteData.brandName}
              </span>
            </div>
            <p className="text-sm text-[#B9AEA5] leading-relaxed">
              Mie kenyal buatan sendiri setiap pagi dengan kuah kaldu sapi gurih dan topping ayam melimpah.
            </p>
          </div>

          {/* Kolom 2: Link anchor & halaman */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white">
              Navigasi
            </p>
            <ul className="space-y-2 text-sm text-[#B9AEA5]">
              {[
                { label: "Tentang", href: "/#tentang" },
                { label: "Menu Unggulan", href: "/#menu" },
                { label: "Daftar Menu", href: "/menu" },
                { label: "Galeri", href: "/#galeri" },
                { label: "Cara Pesan", href: "/#cara-pesan" },
                { label: "Lokasi", href: "/#lokasi" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white">
              Kontak
            </p>
            <ul className="space-y-2.5 text-sm text-[#B9AEA5]">
              <li>
                <a
                  href={`https://wa.me/${siteData.kontak.wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{siteData.kontak.waDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteData.sosmed.igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{siteData.sosmed.ig}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteData.sosmed.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.88-4.47V8.76a8.28 8.28 0 0 0 4.89 1.57V6.89a4.84 4.84 0 0 1-1-.2z" />
                  </svg>
                  <span>{siteData.sosmed.tiktok}</span>
                </a>
              </li>
              {siteData.sosmed.gofoodUrl && (
                <li>
                  <a
                    href={siteData.sosmed.gofoodUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#FF6B6B] hover:text-white transition-colors font-medium"
                  >
                    <div className="relative h-4 w-4 shrink-0">
                      <Image
                        src="/images/gofood-icon.png"
                        alt="GoFood"
                        fill
                        className="object-contain"
                        sizes="16px"
                      />
                    </div>
                    <span>Order di GoFood</span>
                  </a>
                </li>
              )}
              <li>
                <a
                  href={siteData.kontak.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 hover:text-white transition-colors"
                >
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Taman Pinang Indah, Sidoarjo</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Jam Buka */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white">
              Jam Buka
            </p>
            <div className="space-y-1.5 text-sm text-[#B9AEA5]">
              <div className="flex items-center gap-2 text-white font-medium">
                <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Selasa – Minggu</span>
              </div>
              <p>13.00 – Habis</p>
              <p className="text-xs text-[#8A7C72]">Senin Libur</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B9AEA5]">
          <p>© {new Date().getFullYear()} {siteData.brandName}. Hak cipta dilindungi.</p>
          <Link href="/admin/login" className="hover:text-white transition-colors">
            Portal Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
