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

const ORDER_STEPS = [
  {
    step: "1",
    title: "Pilih menu",
    desc: "Tentukan pilihan mie ayam dan minuman dari daftar menu.",
  },
  {
    step: "2",
    title: "Chat WhatsApp",
    desc: "Kirim pesanan langsung ke nomor WhatsApp resmi kami.",
  },
  {
    step: "3",
    title: "Konfirmasi",
    desc: "Kami siapkan pesanan segar sesuai antrean dan catatan Anda.",
  },
  {
    step: "4",
    title: "Ambil / antar",
    desc: "Makan di tempat, ambil sendiri, atau pesan antar ke rumah.",
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
    <div className="bg-[#FAF9F7] text-[#251C17] overflow-x-hidden">
      {/* ── 1. HERO (2 kolom desktop: teks 5/12 kiri, foto 7/12 kanan) ── */}
      <section id="beranda" className="py-12 md:py-20 bg-[#FAF9F7]">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Teks kiri (5/12) */}
            <ScrollReveal animation="slideUp" delay={100} className="lg:col-span-5 space-y-5">
              {/* Status buka/tutup di posisi atas: dengan border dan ukuran lebih proporsional */}
              <div
                role="status"
                className="inline-flex items-center gap-2.5 rounded-full border border-[#DCD5CD] bg-white px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#251C17] shadow-xs"
              >
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full shrink-0 ${statusBuka ? "bg-[#2F7D4F]" : "bg-[#8D0D00]"
                    }`}
                  aria-hidden="true"
                />
                <span className="font-semibold text-[#251C17]">
                  {statusBuka
                    ? "Buka · Sedang melayani pesanan"
                    : "Tutup · Buka besok jam 13.00"}
                </span>
                <span className="text-[#DCD5CD]" aria-hidden="true">·</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.04em] leading-[1.05] text-[#251C17]">
                Mie Ayam Oriental Khas Sidoarjo
              </h1>

              <p className="text-sm md:text-base text-[#6E6259] leading-relaxed">
                Mie kenyal giling segar tiap pagi, kuah kaldu sapi gurih murni, dan topping ayam rempah melimpah.
              </p>

              {/* Daftar menu andalan: satu baris teks polos dipisah tanda '·', tanpa container/chip */}
              <p className="text-xs text-[#8C827A] pt-0.5">
                <span className="font-medium text-[#443831]">Pilihan menu:</span>{" "}
                Mie Ayam Original · Mie Pangsit · Mie Bakso · Mie Komplit
              </p>

              {/* Tombol Aksi & Petunjuk Arah */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#menu"
                  className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#8D0D00] px-5 py-3 text-sm font-semibold text-white hover:bg-[#6F0A00] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D0D00] focus-visible:ring-offset-2"
                >
                  <span>Lihat Menu</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pesan via WhatsApp (buka di tab baru)"
                  className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white border border-[#DCD5CD] px-5 py-3 text-sm font-semibold text-[#251C17] hover:bg-[#F4F0EB] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D0D00] focus-visible:ring-offset-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#8D0D00]" aria-hidden="true" />
                  <span>Pesan via WhatsApp</span>
                </a>

                <a
                  href={kontak.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8D0D00] hover:text-[#6F0A00] hover:underline transition-colors px-2 py-2"
                >
                  <span>Petunjuk arah</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>

              {/* Baris fakta singkat di bawah CTA: teks polos dengan divider tipis */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3 text-xs text-[#6E6259] border-t border-[#E3DDD6]">
                <a
                  href={kontak.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#8D0D00] transition-colors"
                >
                  <div className="flex items-center text-[#D6AC58]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <span className="font-semibold text-[#251C17]">5.0</span>
                  <span>(23 ulasan)</span>
                </a>

                <span className="text-[#DCD5CD]" aria-hidden="true">·</span>

                <span>
                  Mulai <strong className="font-semibold text-[#251C17]">Rp 20.000</strong>
                </span>

                <span className="text-[#DCD5CD]" aria-hidden="true">·</span>

                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8D0D00] shrink-0" aria-hidden="true" />
                  <span>Taman Pinang Indah, Sidoarjo</span>
                </span>
              </div>
            </ScrollReveal>

            {/* Foto kanan (7/12): Gambar mangkok utuh (tanpa crop) dengan drop shadow tipis */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              <ScrollReveal animation="slideUp" delay={200} className="w-full flex flex-col items-center">
                <div className="relative w-full max-w-[460px] md:max-w-[500px] aspect-[1337/1562] flex items-center justify-center">
                  <Parallax speed={0.06} className="w-full h-full overflow-visible flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image
                        src="/images/mangkokmi.png"
                        alt="Semangkuk Mie Ayam Spesial Mie Ayam Surabaya"
                        fill
                        className="object-contain drop-shadow-[0_16px_30px_rgba(37,28,23,0.13)]"
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

      {/* ── 2. TENTANG (2 kolom: foto kiri, teks + 3 angka fakta kanan) ── */}
      <section id="tentang" className="py-16 md:py-20 bg-white border-t border-[#E3DDD6]">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <ScrollReveal animation="slideUp" delay={150} className="lg:col-span-6">
              <Parallax speed={0.05} className="rounded-[24px] border border-[#DCD5CD] bg-[#F4F0EB]">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
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
                heading="Cerita di Balik Semangkuk Mie"
                align="left"
              />

              <p className="text-sm md:text-base text-[#443831] leading-relaxed">
                Setiap pagi kami menggiling adonan mie sendiri tanpa bahan pengawet agar tekstur kenyal alaminya selalu terjaga. Dipadu potongan ayam berbumbu rempah dan kuah kaldu sapi hangat yang direbus perlahan.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#E3DDD6]">
                <div>
                  <p className="text-3xl font-semibold tracking-[-0.03em] text-[#251C17]">
                    {tahunBerdiri}
                  </p>
                  <p className="text-sm text-[#6E6259] mt-0.5">Tahun berdiri</p>
                </div>
                <div className="border-l border-[#E3DDD6] pl-4">
                  <p className="text-3xl font-semibold tracking-[-0.03em] text-[#251C17]">
                    {totalMenuCount}
                  </p>
                  <p className="text-sm text-[#6E6259] mt-0.5">Pilihan menu</p>
                </div>
                <div className="border-l border-[#E3DDD6] pl-4">
                  <p className="text-3xl font-semibold tracking-[-0.03em] text-[#251C17]">
                    100%
                  </p>
                  <p className="text-sm text-[#6E6259] mt-0.5">Halal & segar</p>
                </div>
              </div>

              <div>
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#8D0D00] hover:underline"
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
      <section id="menu" className="py-16 md:py-20 bg-[#FAF9F7] border-t border-[#E3DDD6]">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal animation="slideUp" delay={100} className="mb-10 md:mb-12">
            <SectionHeading
              eyebrow="Menu Unggulan"
              heading="Sajian Favorit Warung"
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
              className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white border border-[#DCD5CD] px-5 py-3 text-sm font-semibold text-[#251C17] hover:bg-[#F4F0EB] transition-colors min-h-[44px]"
            >
              <span>Lihat menu lengkap</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 4. KENAPA PILIH KAMI (Grid 4 kartu) ── */}
      <section id="keunggulan" className="py-16 md:py-20 bg-white border-t border-[#E3DDD6]">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal animation="slideUp" delay={100} className="mb-10 md:mb-12">
            <SectionHeading
              eyebrow="Kualitas Dapur"
              heading="Kenapa Pilih Kami"
              align="left"
            />
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <ScrollReveal key={feat.title} animation="slideUp" delay={150 + idx * 60}>
                  <div className="rounded-[20px] md:rounded-[24px] border border-[#DCD5CD] bg-white p-5 md:p-6 shadow-[0_4px_14px_rgba(46,31,21,0.03)] space-y-4 h-full">
                    <div className="h-10 w-10 rounded-[12px] bg-[#F4F0EB] text-[#8D0D00] grid place-items-center">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold tracking-[-0.02em] text-[#251C17]">
                        {feat.title}
                      </h3>
                      <p className="text-xs md:text-sm text-[#6E6259] mt-1 leading-relaxed">
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
      <section id="galeri" className="py-16 md:py-20 bg-[#FAF9F7] border-t border-[#E3DDD6]">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal animation="slideUp" delay={100} className="mb-8 md:mb-10">
            <SectionHeading
              eyebrow="Galeri Warung"
              heading="Porsi Asli & Suasana Warung"
              subheading="Dokumentasi asli sajian dan area makan kami di Taman Pinang Indah."
              align="left"
            />
          </ScrollReveal>

          <ScrollReveal animation="slideUp" delay={150}>
            <GalleryCarousel items={galeri} mapsGalleryUrl={kontak.mapsLink} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 6. CARA PESAN (4 langkah horizontal) ── */}
      <section id="cara-pesan" className="py-16 md:py-20 bg-white border-t border-[#E3DDD6]">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal animation="slideUp" delay={100} className="mb-10 md:mb-12">
            <SectionHeading
              eyebrow="Cara Pesan"
              heading="Mudah dalam 4 Langkah"
              align="left"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {ORDER_STEPS.map((item, idx) => (
              <ScrollReveal key={item.step} animation="slideUp" delay={150 + idx * 80}>
                <div className="relative flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-[12px] bg-[#F3E4DE] text-[#8D0D00] font-semibold text-sm grid place-items-center shrink-0">
                      {item.step}
                    </div>
                    {idx < ORDER_STEPS.length - 1 && (
                      <div className="hidden md:block flex-1 border-t border-[#DCD5CD]" aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="text-base md:text-lg font-semibold tracking-[-0.02em] text-[#251C17]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#6E6259] mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONI (Ulasan Google Maps + Tombol Buka Semua Ulasan) ── */}
      {testimoni.length > 0 && (
        <section id="testimoni" className="py-16 md:py-20 bg-[#FAF9F7] border-t border-[#E3DDD6]">
          <div className="mx-auto max-w-6xl px-5">
            <ScrollReveal animation="slideUp" delay={100} className="mb-10 md:mb-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <SectionHeading
                  eyebrow="Ulasan Pelanggan"
                  heading="Kata Mereka yang Sudah Mampir"
                  subheading="Ulasan jujur dan asli pelanggan langsung dari Google Maps."
                  align="left"
                />

                <div className="inline-flex items-center gap-2 rounded-full border border-[#DCD5CD] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#251C17] shadow-xs shrink-0 self-start sm:self-auto">
                  <div className="flex items-center gap-0.5 text-[#D6AC58]">
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
                className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white border border-[#DCD5CD] px-6 py-3 text-sm font-semibold text-[#251C17] hover:bg-[#F4F0EB] hover:text-[#8D0D00] transition-colors shadow-xs"
              >
                <span>Buka Semua Ulasan di Google Maps</span>
                <ExternalLink className="w-4 h-4 text-[#8D0D00]" aria-hidden="true" />
              </a>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── 8. LOKASI & JAM BUKA (Ringkas: Selasa-Minggu jam 13.00, Senin Libur) ── */}
      <section id="lokasi" className="py-16 md:py-20 bg-white border-t border-[#E3DDD6]">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal animation="slideUp" delay={100} className="mb-10 md:mb-12">
            <SectionHeading
              eyebrow="Lokasi & Jam Buka"
              heading="Kunjungi Warung Kami"
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

              <div className="rounded-[20px] border border-[#DCD5CD] bg-[#FAF9F7] p-5 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#251C17]">
                  <MapPin className="w-4 h-4 text-[#8D0D00] shrink-0" aria-hidden="true" />
                  <span>Alamat Warung</span>
                </div>
                <p className="text-sm text-[#443831] leading-relaxed">
                  {kontak.alamat}
                </p>
              </div>

              {/* Jam operasional ringkas tanpa daftar per hari */}
              <HoursTable />
            </ScrollReveal>

            {/* Kanan (7 cols): Peta Google Maps + tombol link */}
            <ScrollReveal animation="slideUp" delay={200} className="lg:col-span-7 space-y-4">
              <div className="overflow-hidden rounded-[24px] border border-[#DCD5CD] bg-[#F4F0EB] h-[360px] md:h-[430px]">
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
                  className="inline-flex items-center gap-2 rounded-[12px] bg-white border border-[#DCD5CD] px-4 py-2.5 text-sm font-semibold text-[#251C17] hover:bg-[#F4F0EB] transition-colors min-h-[44px]"
                >
                  <span>Buka Petunjuk Arah di Google Maps</span>
                  <ExternalLink className="w-4 h-4 text-[#8D0D00]" aria-hidden="true" />
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 9. CTA PENUTUP (Dengan Parallax) ── */}
      <section id="kontak" className="py-16 md:py-20 bg-[#FAF9F7] border-t border-[#E3DDD6]">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal animation="scale" delay={150}>
            <div className="rounded-[28px] bg-[#1E1612] p-8 md:p-12 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] leading-[1.15] text-white">
                  Lapar? Pesan Mie Ayam Sekarang
                </h2>
                <p className="text-sm md:text-base text-[#E3DDD6] max-w-lg leading-relaxed">
                  Langsung pesan untuk makan di tempat, bungkus bawa pulang, atau antar ke rumah melalui WhatsApp.
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-4">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#8D0D00] px-5 py-3 text-sm font-semibold text-white hover:bg-[#A01414] transition-colors min-h-[44px]"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Pesan via WhatsApp</span>
                  </a>
                  <span className="text-xs text-[#B9AEA5]">
                    Buka tiap Selasa – Minggu jam 13.00 (Senin Libur)
                  </span>
                </div>
              </div>

              <div className="hidden lg:block lg:col-span-5">
                <Parallax speed={0.06} className="rounded-[20px] border border-[#34261F]">
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
