"use client";

import Image from "next/image";
import Link from "next/link";
import { useLiveData } from "@/lib/public/LiveDataContext";
import SectionHeading from "@/components/public/SectionHeading";
import StatusBadge from "@/components/public/StatusBadge";
import MenuCard from "@/components/public/MenuCard";
import TestimonialCard from "@/components/public/TestimonialCard";
import HoursTable from "@/components/public/HoursTable";
import GalleryCarousel from "@/components/public/GalleryCarousel";
import ScrollReveal from "@/components/public/ScrollReveal";
import Parallax from "@/components/public/Parallax";
import StampBadge from "@/components/public/StampBadge";
import {
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
  UtensilsCrossed,
  Soup,
  ShieldCheck,
  Wallet,
  ArrowRight,
  Star,
} from "lucide-react";

const FEATURES = [
  {
    icon: UtensilsCrossed,
    title: "Mie segar tiap pagi",
    desc: "Digiling sendiri tanpa pengawet agar kenyal alami.",
  },
  {
    icon: Soup,
    title: "Kaldu sapi murni",
    desc: "Rebusan tulang sapi dan rempah menghasilkan kuah gurih.",
  },
  {
    icon: ShieldCheck,
    title: "100% halal & bersih",
    desc: "Bahan terjamin halal dan diolah di dapur terbuka yang bersih.",
  },
  {
    icon: Wallet,
    title: "Harga terjangkau",
    desc: "Porsi pas mengenyangkan dengan harga ramah di kantong.",
  },
];

const ORDER_CHANNELS = [
  {
    number: "1",
    title: "Chat WhatsApp",
    badge: "Makan di Tempat & Bungkus (Takeaway)",
    desc: "Pesan langsung untuk makan di warung atau bungkus bawa pulang (ambil di tempat) tanpa perlu antre lama.",
    buttonText: "Pesan via WhatsApp",
    isWa: true,
  },
  {
    number: "2",
    title: "GoFood",
    badge: "Pesan Online (Kurir Gojek)",
    desc: "Pesan online praktis dari rumah atau kantor, pesanan diantar kurir Gojek langsung ke depan pintu Anda.",
    buttonText: "Order di GoFood",
    isGoFood: true,
  },
];

export default function HomePage() {
  const { siteData } = useLiveData();
  const {
    kontak,
    menuMakanan,
    menuMinuman,
    testimoni,
    statusBuka,
    statusBukaNote,
    brandName,
    tahunBerdiri,
    galeri,
  } = siteData;

  const waLink = `https://wa.me/${kontak.wa}?text=${encodeURIComponent(
    `Halo ${brandName}, saya ingin memesan.`
  )}`;

  const featuredMenus = [...menuMakanan, ...menuMinuman].slice(0, 6);
  const totalMenuCount = menuMakanan.length + menuMinuman.length;

  return (
    <div className="bg-[#FAF9F7] text-[#1F1916] overflow-x-hidden">
      {/* ── 1. HERO (2 kolom desktop: teks 5/12 kiri, foto 7/12 kanan) ── */}
      <section id="beranda" className="relative py-12 md:py-20 bg-gradient-to-b from-[#FFFDFB] via-[#FAF6F2] to-[#FAF9F7] overflow-hidden">
        {/* Ambient red circular glow in background (Foodie reference style) */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#D10B0C]/12 via-[#FF5252]/8 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr from-[#D10B0C]/8 via-[#FFA8A8]/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Teks kiri (5/12) */}
            <ScrollReveal animation="slideUp" delay={100} className="lg:col-span-5 space-y-5">
              {/* Status buka/tutup di posisi atas: dengan border dan aksen lokasi */}
              <div
                role="status"
                className="inline-flex items-center gap-2.5 rounded-full border border-[#FFD9D9] bg-[#FFF5F5] px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#D10B0C] shadow-xs"
              >
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full shrink-0 ${statusBuka ? "bg-[#2F7D4F]" : "bg-[#D10B0C]"
                    }`}
                  aria-hidden="true"
                />
                <span className="font-bold text-[#1F1916]">
                  {statusBuka
                    ? "Buka · Sedang melayani pesanan"
                    : "Tutup · Buka besok jam 13.00"}
                </span>
                <span className="text-[#E8D0CE]" aria-hidden="true">·</span>
                <span className="text-[#D10B0C] font-semibold">Taman Pinang Indah</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-[-0.04em] leading-[1.05] text-[#1F1916]">
                Mie Ayam Oriental{" "}
                <span className="bg-gradient-to-r from-[#D10B0C] via-[#E52D2E] to-[#D10B0C] bg-clip-text text-transparent">
                  Khas Sidoarjo
                </span>
              </h1>

              <p className="text-sm md:text-base text-[#6B5E55] leading-relaxed">
                Mie kenyal giling segar tiap pagi, kuah kaldu sapi gurih murni, dan topping ayam rempah melimpah.
              </p>

              {/* Daftar menu andalan: satu baris teks polos dipisah tanda '·', tanpa container/chip */}
              <p className="text-xs text-[#8C7E74] pt-0.5">
                <span className="font-bold text-[#1F1916]">Pilihan menu:</span>{" "}
                Mie Ayam Original · Mie Pangsit · Mie Bakso · Mie Komplit
              </p>

              {/* Tombol Aksi & Petunjuk Arah */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#menu"
                  className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#D10B0C] to-[#E52D2E] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#D10B0C]/25 hover:from-[#B80809] hover:to-[#CF1718] hover:shadow-lg hover:shadow-[#D10B0C]/35 transition-all min-h-[46px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D10B0C] focus-visible:ring-offset-2"
                >
                  <span>Lihat Menu</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pesan via WhatsApp (buka di tab baru)"
                  className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-white border border-[#E8E2DC] px-5 py-3.5 text-sm font-semibold text-[#1F1916] hover:border-[#D10B0C] hover:text-[#D10B0C] hover:bg-[#FFF8F8] transition-all min-h-[46px] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D10B0C] focus-visible:ring-offset-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#D10B0C]" aria-hidden="true" />
                  <span>Pesan via WhatsApp</span>
                </a>

                {kontak.gofoodUrl && (
                  <a
                    href={kontak.gofoodUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Pesan via GoFood (buka di tab baru)"
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-white border border-[#E8E2DC] px-4 py-2 hover:border-[#D10B0C]/40 hover:bg-[#FFF9F9] transition-all min-h-[46px] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D10B0C] focus-visible:ring-offset-2"
                  >
                    <span className="text-xs font-bold text-[#1F1916]">Order di</span>
                    <div className="relative h-6 w-20">
                      <Image
                        src="/images/gofood-logo.png"
                        alt="GoFood"
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    </div>
                  </a>
                )}

                <a
                  href={kontak.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#D10B0C] hover:text-[#9A0708] hover:underline transition-colors px-2 py-2"
                >
                  <span>Petunjuk arah</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>

              {/* Baris fakta singkat di bawah CTA: data Google Maps nyata */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3.5 text-xs text-[#6B5E55] border-t border-[#E8E2DC]">
                <a
                  href={kontak.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#D10B0C] transition-colors"
                >
                  <div className="flex items-center text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <span className="font-bold text-[#1F1916]">5.0</span>
                  <span>(23 ulasan Google Maps)</span>
                </a>

                <span className="text-[#DCD5CD]" aria-hidden="true">·</span>

                <span>
                  Rentang harga <strong className="font-bold text-[#D10B0C]">Rp 25–50 rb</strong>
                </span>

                <span className="text-[#DCD5CD]" aria-hidden="true">·</span>

                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D10B0C] shrink-0" aria-hidden="true" />
                  <span className="font-medium text-[#1F1916]">Taman Pinang Indah, Sidoarjo</span>
                </span>

                <span className="text-[#DCD5CD]" aria-hidden="true">·</span>

                <a
                  href={siteData.sosmed.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#1F1916] hover:text-[#D10B0C] transition-colors"
                  aria-label="Lihat akun TikTok resmi"
                >
                  <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.88-4.47V8.76a8.28 8.28 0 0 0 4.89 1.57V6.89a4.84 4.84 0 0 1-1-.2z" />
                  </svg>
                  <span>{siteData.sosmed.tiktok}</span>
                </a>
              </div>
            </ScrollReveal>

            {/* Foto kanan (7/12): Gambar mangkok utuh (tanpa crop) dengan ambient halo & drop shadow */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              <ScrollReveal animation="slideUp" delay={200} className="w-full flex flex-col items-center">
                <div className="relative w-full max-w-[460px] md:max-w-[500px] aspect-[1337/1562] flex items-center justify-center">
                  <Parallax speed={0.06} className="w-full h-full overflow-visible flex items-center justify-center relative">
                    {/* Ambient warm oriental vermilion glow halo */}
                    <div className="absolute inset-0 max-w-[390px] max-h-[390px] m-auto rounded-full bg-gradient-to-tr from-[#D10B0C]/15 via-[#FF6B6B]/8 to-transparent blur-3xl -z-10 pointer-events-none" />

                    {/* Circular traditional lattice pattern watermark */}
                    <div className="absolute inset-0 m-auto w-[340px] sm:w-[440px] h-[340px] sm:h-[440px] opacity-[0.06] pointer-events-none select-none -z-10">
                      <Image
                        src="/assets/oriental/pattern-disc.svg"
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="relative w-full h-full">
                      <Image
                        src="/images/mangkokmi.png"
                        alt="Semangkuk Mie Ayam Spesial Mie Ayam Surabaya"
                        fill
                        className="object-contain drop-shadow-[0_20px_35px_rgba(31,25,22,0.14)]"
                        priority
                        sizes="(max-width: 1024px) 100vw, 500px"
                      />
                    </div>
                  </Parallax>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TENTANG (2 kolom: foto kiri dengan stamp seal oriental, teks + 3 kartu fakta kanan) ── */}
      <section id="tentang" className="py-16 md:py-20 bg-white border-t border-[#E8E2DC]">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <ScrollReveal animation="slideUp" delay={150} className="lg:col-span-6">
              <Parallax speed={0.05} className="relative rounded-[28px] border border-[#E8E2DC] bg-[#FAF7F4] shadow-sm">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px]">
                  <Image
                    src="/images/1.png"
                    alt={`Suasana dapur dan warung ${brandName}`}
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </Parallax>
            </ScrollReveal>

            <ScrollReveal animation="slideUp" delay={250} className="lg:col-span-6 space-y-6">
              <SectionHeading
                eyebrow="Tentang Kami"
                heading="Cerita di Balik"
                headingAccent="Semangkuk Mie"
                align="left"
              />

              <p className="text-sm md:text-base text-[#4B3E36] leading-relaxed">
                Setiap pagi kami menggiling adonan mie sendiri tanpa bahan pengawet agar tekstur kenyal alaminya selalu terjaga. Dipadu potongan ayam berbumbu rempah dan kuah kaldu sapi hangat yang direbus perlahan.
              </p>

              {/* 3 Metric Cards inspired by Foodie Reference */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-5 border-t border-[#E8E2DC]">
                <div className="rounded-2xl bg-[#FFF5F5] border border-[#FFD9D9] p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#D10B0C]">
                    {tahunBerdiri}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-[#7D6B60] mt-1">Tahun berdiri</p>
                </div>
                <div className="rounded-2xl bg-white border border-[#E8E2DC] p-4 text-center shadow-xs">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#1F1916]">
                    {totalMenuCount}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-[#7D6B60] mt-1">Pilihan menu</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-[#D10B0C] to-[#E52D2E] p-4 text-center text-white shadow-sm shadow-[#D10B0C]/25">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-white">
                    100%
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-white/90 mt-1">Halal & segar</p>
                </div>
              </div>

              <div>
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#D10B0C] hover:underline"
                >
                  <span>Baca cerita selengkapnya</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 3. MENU UNGGULAN (Grid md:grid-cols-3) ── */}
      <section id="menu" className="py-16 md:py-20 bg-[#FAF9F7] border-t border-[#E8E2DC]">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal animation="slideUp" delay={100} className="mb-10 md:mb-12">
            <SectionHeading
              eyebrow="Menu Unggulan"
              heading="Sajian Favorit"
              headingAccent="Warung Kami"
              subheading="Dibuat segar tiap pagi dengan mie kenyal alami dan kuah kaldu sapi gurih."
              align="left"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredMenus.map((item, idx) => (
              <ScrollReveal key={item.id} animation="slideUp" delay={150 + idx * 80}>
                <MenuCard
                  name={item.nama}
                  description={item.deskripsi}
                  price={item.harga}
                  imageUrl={item.foto}
                  badge={idx === 0 ? item.badge || "Terlaris" : item.badge}
                  isAvailable={item.isAvailable ?? true}
                  waNumber={kontak.wa}
                />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="fadeIn" delay={300} className="mt-10 text-center">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-white border border-[#E8E2DC] px-6 py-3.5 text-sm font-bold text-[#1F1916] hover:bg-[#FFF5F5] hover:text-[#D10B0C] hover:border-[#D10B0C]/40 shadow-xs transition-all min-h-[46px]"
            >
              <span>Lihat menu lengkap</span>
              <ArrowRight className="w-4 h-4 text-[#D10B0C]" aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 4. KENAPA PILIH KAMI (Grid 4 kartu) ── */}
      <section id="keunggulan" className="py-16 md:py-20 bg-white border-t border-[#E8E2DC]">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal animation="slideUp" delay={100} className="mb-10 md:mb-12">
            <SectionHeading
              eyebrow="Kualitas Dapur"
              heading="Kenapa Memilih"
              headingAccent="Mie Kami?"
              align="left"
            />
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <ScrollReveal key={feat.title} animation="slideUp" delay={150 + idx * 60}>
                  <div className="rounded-[22px] border border-[#E8E2DC] bg-[#FAF9F7] p-5 md:p-6 shadow-[0_4px_16px_rgba(31,25,22,0.03)] space-y-4 h-full hover:border-[#D10B0C]/40 hover:bg-white hover:shadow-md transition-all">
                    <div className="h-11 w-11 rounded-[14px] bg-[#FFF5F5] border border-[#FFD9D9] text-[#D10B0C] grid place-items-center">
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold tracking-[-0.02em] text-[#1F1916]">
                        {feat.title}
                      </h3>
                      <p className="text-xs md:text-sm text-[#6B5E55] mt-1 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. GALERI SLIDER RAPI (Carousel rapi + Google Maps link) ── */}
      <section id="galeri" className="py-16 md:py-20 bg-[#FAF9F7] border-t border-[#E8E2DC]">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal animation="slideUp" delay={100} className="mb-8 md:mb-10">
            <SectionHeading
              eyebrow="Galeri Warung"
              heading="Porsi Asli &"
              headingAccent="Suasana Warung"
              subheading="Dokumentasi asli sajian dan area makan kami di Taman Pinang Indah."
              align="left"
            />
          </ScrollReveal>

          <ScrollReveal animation="slideUp" delay={150}>
            <GalleryCarousel items={galeri} mapsGalleryUrl={kontak.mapsLink} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 6. CARA PESAN (2 Opsi Pemesanan: Chat WA & GoFood) ── */}
      <section id="cara-pesan" className="py-16 md:py-20 bg-white border-t border-[#E8E2DC]">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal animation="slideUp" delay={100} className="mb-10 md:mb-12">
            <SectionHeading
              eyebrow="Cara Pemesanan"
              heading="Pesan Mudah Lewat"
              headingAccent="2 Pilihan Praktis"
              subheading="Nikmati sajian langsung di warung atau diantar kurir ke rumah Anda."
              align="left"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Opsi 1: Chat WA */}
            <ScrollReveal animation="slideUp" delay={150}>
              <div className="h-full rounded-[24px] border border-[#E8E2DC] bg-[#FAF9F7] p-6 sm:p-8 flex flex-col justify-between hover:border-[#D10B0C]/40 hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F8EE] border border-[#C2ECCF] px-3 py-1 text-xs font-bold text-[#1E7E34]">
                      <span className="flex h-2 w-2 rounded-full bg-[#25D366]" />
                      <span>Makan di Tempat & Bungkus (Takeaway)</span>
                    </div>
                    <span className="text-2xl font-black text-[#D10B0C]/30">01</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#1F1916]">
                    1. Chat via WhatsApp
                  </h3>

                  <p className="text-sm text-[#6B5E55] leading-relaxed">
                    Cocok untuk Anda yang ingin <strong>makan langsung di warung</strong> atau <strong>bungkus bawa pulang (ambil sendiri)</strong>. Pesan lebih awal agar hidangan hangat siap saat Anda tiba tanpa perlu menunggu lama.
                  </p>

                  <ul className="space-y-2 text-xs sm:text-sm text-[#4B3E36] pt-1">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D10B0C]" />
                      <span>Tulis menu pilihan dan jumlah porsi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D10B0C]" />
                      <span>Sebutkan perkiraan jam kedatangan Anda</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D10B0C]" />
                      <span>Pesanan dibuat fresh sesaat sebelum disajikan</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-4 border-t border-[#E8E2DC]">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-3.5 text-sm font-bold shadow-md shadow-[#25D366]/25 transition-all min-h-[46px]"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Pesan Lewat WhatsApp</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Opsi 2: GoFood */}
            <ScrollReveal animation="slideUp" delay={250}>
              <div className="h-full rounded-[24px] border border-[#E8E2DC] bg-white p-6 sm:p-8 flex flex-col justify-between hover:border-[#EE2737]/40 hover:shadow-md transition-all shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF0F1] border border-[#FFD0D4] px-3 py-1 text-xs font-bold text-[#EE2737]">
                      <span className="flex h-2 w-2 rounded-full bg-[#EE2737]" />
                      <span>Pesan Antar Online (Kurir Gojek)</span>
                    </div>
                    <span className="text-2xl font-black text-[#EE2737]/30">02</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#1F1916]">
                      2. Order di
                    </h3>
                    <div className="relative h-7 w-24">
                      <Image
                        src="/images/gofood-logo.png"
                        alt="GoFood Official"
                        fill
                        className="object-contain"
                        sizes="96px"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-[#6B5E55] leading-relaxed">
                    Mau santap mie ayam hangat tanpa keluar rumah? Pesan online langsung melalui <strong>GoFood</strong>, kurir Gojek siap mengantar pesanan langsung ke lokasi Anda.
                  </p>

                  <ul className="space-y-2 text-xs sm:text-sm text-[#4B3E36] pt-1">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#EE2737]" />
                      <span>Buka merchant <em>Mie Ayam Surabaya, Taman Pinang</em></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#EE2737]" />
                      <span>Pilih varian menu & aneka minuman segar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#EE2737]" />
                      <span>Pantau status pengantaran secara real-time</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-4 border-t border-[#E8E2DC]">
                  <a
                    href={kontak.gofoodUrl || "https://gofood.co.id/surabaya/restaurant/mie-ayam-surabaya-taman-pinang-sidoarjo-26ae8787-58a9-4a86-bb97-cc99132ddb0e"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#EE2737] hover:bg-[#D41C2C] text-white px-5 py-3.5 text-sm font-bold shadow-md shadow-[#EE2737]/25 transition-all min-h-[46px]"
                  >
                    <div className="relative h-5 w-5 shrink-0">
                      <Image
                        src="/images/gofood-icon.png"
                        alt="GoFood Icon"
                        fill
                        className="object-contain"
                        sizes="20px"
                      />
                    </div>
                    <span>Buka Menu di GoFood</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONI (Ulasan Google Maps + Tombol Buka Semua Ulasan) ── */}
      {testimoni.length > 0 && (
        <section id="testimoni" className="py-16 md:py-20 bg-[#FAF9F7] border-t border-[#E8E2DC]">
          <div className="mx-auto max-w-6xl px-5">
            <ScrollReveal animation="slideUp" delay={100} className="mb-10 md:mb-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <SectionHeading
                  eyebrow="Ulasan Pelanggan"
                  heading="Kata Mereka yang"
                  headingAccent="Sudah Mampir"
                  subheading="Ulasan jujur dan asli pelanggan langsung dari Google Maps."
                  align="left"
                />

                <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD9D9] bg-[#FFF5F5] px-4 py-1.5 text-xs font-bold text-[#D10B0C] shadow-xs shrink-0 self-start sm:self-auto">
                  <div className="flex items-center gap-0.5 text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <span>5.0 di Google Maps</span>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimoni.map((t, idx) => (
                <ScrollReveal key={t.nama} animation="slideUp" delay={150 + idx * 70}>
                  <TestimonialCard
                    nama={t.nama}
                    teks={t.teks}
                    rating={t.rating}
                    mapsUrl={kontak.mapsLink}
                    highlighted={idx === 1}
                  />
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal animation="fadeIn" delay={300} className="mt-10 text-center">
              <a
                href={kontak.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-white border border-[#E8E2DC] px-6 py-3.5 text-sm font-bold text-[#1F1916] hover:bg-[#FFF5F5] hover:text-[#D10B0C] hover:border-[#D10B0C]/40 transition-all shadow-xs"
              >
                <span>Buka Semua Ulasan di Google Maps</span>
                <ExternalLink className="w-4 h-4 text-[#D10B0C]" aria-hidden="true" />
              </a>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── 8. LOKASI & JAM BUKA (Ringkas: Selasa-Minggu jam 13.00, Senin Libur) ── */}
      <section id="lokasi" className="py-16 md:py-20 bg-white border-t border-[#E8E2DC]">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal animation="slideUp" delay={100} className="mb-10 md:mb-12">
            <SectionHeading
              eyebrow="Lokasi & Jam Buka"
              heading="Kunjungi Warung"
              headingAccent="Kami di Sidoarjo"
              align="left"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Kiri (5 cols): Status + Alamat + Jam Operasional Ringkas */}
            <ScrollReveal animation="slideUp" delay={150} className="lg:col-span-5 space-y-5">
              <div>
                <StatusBadge
                  isOpen={statusBuka}
                  note={statusBukaNote || "Buka tiap Selasa – Minggu jam 13.00 (Senin Libur)"}
                />
              </div>

              <div className="rounded-[22px] border border-[#E8E2DC] bg-[#FAF9F7] p-5 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#1F1916]">
                  <MapPin className="w-4 h-4 text-[#D10B0C] shrink-0" aria-hidden="true" />
                  <span>Alamat Warung</span>
                </div>
                <p className="text-sm text-[#4B3E36] leading-relaxed">
                  {kontak.alamat}
                </p>
              </div>

              {/* Jam operasional ringkas tanpa daftar per hari */}
              <HoursTable />
            </ScrollReveal>

            {/* Kanan (7 cols): Peta Google Maps + tombol link */}
            <ScrollReveal animation="slideUp" delay={200} className="lg:col-span-7 space-y-4">
              <div className="overflow-hidden rounded-[26px] border border-[#E8E2DC] bg-[#F8F5F2] h-[360px] md:h-[430px]">
                <iframe
                  title="Peta Lokasi Mie Ayam Surabaya di Taman Pinang Indah, Sidoarjo"
                  src={kontak.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="flex justify-end">
                <a
                  href={kontak.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[14px] bg-white border border-[#E8E2DC] px-5 py-3 text-sm font-bold text-[#1F1916] hover:bg-[#FFF5F5] hover:text-[#D10B0C] hover:border-[#D10B0C]/40 transition-all min-h-[44px] shadow-xs"
                >
                  <span>Buka Petunjuk Arah di Google Maps</span>
                  <ExternalLink className="w-4 h-4 text-[#D10B0C]" aria-hidden="true" />
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 9. CTA PENUTUP (Dengan Parallax & Nuansa Merah Elegan) ── */}
      <section id="kontak" className="py-16 md:py-20 bg-[#FAF9F7] border-t border-[#E8E2DC]">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal animation="scale" delay={150}>
            <div className="rounded-[32px] bg-gradient-to-br from-[#1C0F0E] via-[#2A1110] to-[#1C0F0E] border border-[#D10B0C]/30 p-8 md:p-14 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-2xl">
              {/* Subtle oriental circular watermark in background */}
              <div className="absolute -right-12 -bottom-12 w-80 h-80 opacity-10 pointer-events-none select-none">
                <Image
                  src="/assets/oriental/pattern-disc.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>

              <div className="lg:col-span-7 space-y-5 relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.12] text-white">
                  Lapar? Pesan{" "}
                  <span className="bg-gradient-to-r from-[#FF4D4D] to-[#FFA8A8] bg-clip-text text-transparent">
                    Mie Ayam
                  </span>{" "}
                  Sekarang
                </h2>
                <p className="text-sm md:text-base text-[#E5DCD4] max-w-lg leading-relaxed">
                  Langsung pesan untuk makan di tempat atau bungkus bawa pulang via WhatsApp, atau pesan online diantar kurir melalui GoFood.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#D10B0C] to-[#E52D2E] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#D10B0C]/40 hover:from-[#B80809] hover:to-[#CF1718] transition-all min-h-[46px]"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Pesan via WhatsApp</span>
                  </a>

                  {kontak.gofoodUrl && (
                    <a
                      href={kontak.gofoodUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-white text-[#1F1916] hover:bg-[#FFF5F5] px-4 py-2.5 text-sm font-bold shadow-md transition-all min-h-[46px]"
                    >
                      <span className="text-xs font-bold text-[#1F1916]">Order di</span>
                      <div className="relative h-6 w-20">
                        <Image
                          src="/images/gofood-logo.png"
                          alt="GoFood"
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </div>
                    </a>
                  )}

                  <span className="text-xs text-[#C4B7AC]">
                    Buka tiap Selasa – Minggu jam 13.00 (Senin Libur)
                  </span>
                </div>
              </div>

              <div className="hidden lg:block lg:col-span-5 relative z-10">
                <Parallax speed={0.06} className="rounded-[22px] border border-[#4A2624] overflow-hidden shadow-lg">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src="/images/mie-ayam-bakso.png"
                      alt="Mie Ayam Bakso hangat siap disajikan"
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes="40vw"
                    />
                  </div>
                </Parallax>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
