import Image from "next/image";
import { siteConfig } from "@/data/site.config";
import WaveDivider from "@/components/public/WaveDivider";
import StampBadge from "@/components/public/StampBadge";
import StatusBadge from "@/components/public/StatusBadge";
import SectionHeading from "@/components/public/SectionHeading";
import MenuCard from "@/components/public/MenuCard";
import TestimonialCard from "@/components/public/TestimonialCard";
import IconLine from "@/components/public/IconLine";
import { MapPin, Phone, MessageCircle, ExternalLink } from "lucide-react";

export const revalidate = 60;

export default function HomePage() {
  const { copy, kontak, sosmed, menuMakanan, menuMinuman, testimoni, galeri, statusBuka, statusBukaNote } =
    siteConfig;

  const waLink = `https://wa.me/${kontak.wa}?text=Halo%20${encodeURIComponent(
    siteConfig.brandName
  )}%2C%20saya%20ingin%20memesan.`;

  // Makanan: 1 kartu utama besar (Mie Ayam Komplit) + 3 kartu makanan (Mie Ayam ori, Mie Ayam Bakso, Mie Ayam Pangsit)
  const [mainFood, ...restFood] = menuMakanan;

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════════
          b. HERO SECTION
          - Foto mie ayam BLEED full-width sebagai background
          - Overlay merah bata 40% (rgba(139, 30, 30, 0.42))
          - Teks putih besar + subteks + 2 tombol pill
          - StatusBadge di pojok kanan atas
         ═══════════════════════════════════════════════════════════════ */}
      <section
        id="beranda"
        className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 pb-20"
      >
        {/* Full-bleed background image with high fetchpriority */}
        <div className="absolute inset-0">
          <Image
            src="/images/fotomie.png"
            alt={`Semangkuk ${siteConfig.brandName} komplit dengan topping melimpah`}
            fill
            className="object-cover object-center"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
          {/* Overlay merah bata untuk kontras teks WCAG AA */}
          <div
            className="absolute inset-0 bg-[#8B1E1E]/45"
            aria-hidden="true"
          />
          {/* Gradient tambahan di sebelah kiri agar tulisan terbaca sempurna */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#6B1515]/75 via-[#8B1E1E]/40 to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Badge status buka di pojok kanan atas hero */}
        <div className="absolute top-24 right-5 sm:right-10 z-20">
          <StatusBadge isOpen={statusBuka} note={statusBukaNote} />
        </div>

        {/* StampBadge aksen pojok kanan (desktop) */}
        <div className="hidden lg:block absolute bottom-24 right-12 z-20 opacity-85">
          <StampBadge
            text="AUTENTIK · ORIENTAL · SIDOARJO · 2024 ·"
            size={110}
            bgColor="#6B1515"
            borderColor="#F5E6D3"
            textColor="#F5E6D3"
          />
        </div>

        {/* Konten teks hero */}
        <div className="relative z-10 max-w-6xl mx-auto w-full px-5 sm:px-8 mt-4 sm:mt-8">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#F5E6D3] font-bold">
                {copy.hero.eyebrow}
              </span>
            </div>

            {/* H1 Heading */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white uppercase leading-[0.92] mb-5">
              {copy.hero.heading}
              <br />
              <span className="text-[#F5E6D3]">{copy.hero.headingAccent}</span>
            </h1>

            {/* Subteks */}
            <p className="text-white/90 font-sans text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              {copy.hero.subteks}
            </p>

            {/* 2 Tombol Pill (Lihat Menu & Pesan via WA) */}
            <div className="flex flex-wrap gap-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pesan via WhatsApp (buka di tab baru)"
                className="inline-flex items-center gap-2.5 bg-white text-[#8B1E1E] hover:bg-[#F5E6D3] font-bold text-sm uppercase tracking-wider px-7 py-3.5 rounded-full transition-all duration-200 min-h-[48px] shadow-lg hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{copy.hero.ctaWa}</span>
              </a>

              <a
                href="#menu"
                aria-label="Lihat daftar menu unggulan"
                className="inline-flex items-center gap-2 bg-transparent hover:bg-white/15 text-white border-2 border-white/80 hover:border-white font-bold text-sm uppercase tracking-wider px-7 py-3.5 rounded-full transition-all duration-200 min-h-[48px]"
              >
                <span>{copy.hero.ctaMenu}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Wave divider bawah transisi ke krem */}
        <WaveDivider
          direction="bottom"
          color="#FAF0E6"
          className="absolute bottom-0 left-0 right-0 z-10"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          c. TENTANG KAMI
          - 2 kolom: foto warung di kiri (bleed), teks di kanan
          - StampBadge di pojok foto
         ═══════════════════════════════════════════════════════════════ */}
      <section id="tentang" className="bg-[#FAF0E6] py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Kolom kiri: Foto warung BLEED dengan StampBadge di pojok */}
            <div className="relative">
              <div className="relative rounded-[12px] overflow-hidden aspect-[4/3] bg-stone-900 shadow-sm">
                <Image
                  src={copy.tentang.foto}
                  alt={`Tentang Warung ${siteConfig.brandName}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>

              {/* StampBadge di pojok kanan bawah foto */}
              <div className="absolute -bottom-5 -right-3 z-10 drop-shadow-xl">
                <StampBadge
                  text={copy.tentang.badgeText}
                  size={104}
                  bgColor="#8B1E1E"
                  borderColor="#FAF0E6"
                  textColor="#FAF0E6"
                />
              </div>
            </div>

            {/* Kolom kanan: Teks Cerita Kami */}
            <div className="space-y-5 lg:pl-4">
              <SectionHeading
                eyebrow={copy.tentang.eyebrow}
                heading={copy.tentang.heading}
                headingAccent={copy.tentang.headingAccent}
                align="left"
              />

              <p className="text-stone-700 font-sans text-sm sm:text-base leading-relaxed">
                {copy.tentang.p1}
              </p>

              <p className="text-stone-600 font-sans text-sm sm:text-base leading-relaxed">
                {copy.tentang.p2}
              </p>

              <div className="pt-2">
                <a
                  href="#menu"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#8B1E1E] hover:text-[#6B1515] transition-colors uppercase tracking-wider group"
                >
                  <span>Lihat Sajian Kami</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>

        <WaveDivider direction="bottom" color="#FAF0E6" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          d. MENU UNGGULAN (MAKANAN & MINUMAN)
          - Background krem (#FAF0E6)
          - Grid asimetris makanan: 1 kartu besar + kartu pendukung
          - Termasuk Mie Ayam (ori), Es Teh, Teh Hangat
          - Foto BLEED di dalam kartu (tanpa border putih tebal)
         ═══════════════════════════════════════════════════════════════ */}
      <section id="menu" className="py-20 sm:py-28 bg-[#FAF0E6]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-16">

          {/* Subseksi 1: Makanan */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
              <SectionHeading
                eyebrow={copy.menu.eyebrow}
                heading={copy.menu.heading}
                headingAccent={copy.menu.headingAccent}
                subheading={copy.menu.subheading}
                align="left"
              />
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pesan via WhatsApp (buka di tab baru)"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#8B1E1E] hover:text-[#6B1515] uppercase tracking-widest transition-colors shrink-0 pb-1"
              >
                <span>Pesan Sekarang</span>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            {/* Grid asimetris: 1 kartu besar (Mie Ayam Komplit) + 3 kartu kecil (Mie Ayam ori, Bakso, Pangsit) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
              {/* 1 Kartu Besar */}
              {mainFood && (
                <div className="md:col-span-3">
                  <MenuCard
                    name={mainFood.nama}
                    description={mainFood.deskripsi}
                    price={mainFood.harga}
                    imageUrl={mainFood.foto}
                    badge={mainFood.badge}
                    isAvailable={mainFood.isAvailable ?? true}
                    waNumber={kontak.wa}
                    variant="large"
                  />
                </div>
              )}

              {/* Kartu Makanan lainnya stacked */}
              <div className="md:col-span-2 flex flex-col gap-4 sm:gap-6">
                {restFood.slice(0, 2).map((item) => (
                  <MenuCard
                    key={item.id}
                    name={item.nama}
                    description={item.deskripsi}
                    price={item.harga}
                    imageUrl={item.foto}
                    badge={item.badge}
                    isAvailable={item.isAvailable ?? true}
                    waNumber={kontak.wa}
                    variant="small"
                  />
                ))}
              </div>

              {/* Kartu Makanan ke-4 (Mie Ayam Pangsit) */}
              {restFood[2] && (
                <div className="md:col-span-5">
                  <MenuCard
                    name={restFood[2].nama}
                    description={restFood[2].deskripsi}
                    price={restFood[2].harga}
                    imageUrl={restFood[2].foto}
                    badge={restFood[2].badge}
                    isAvailable={restFood[2].isAvailable ?? true}
                    waNumber={kontak.wa}
                    variant="small"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Subseksi 2: Minuman Segar (Es Teh, Teh Hangat, Es Teler) */}
          <div className="pt-6 border-t border-stone-200/70">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
              <SectionHeading
                eyebrow="Penyegar Dahaga"
                heading="Pilihan Minuman"
                headingAccent="Segar & Pelepas Dahaga"
                subheading="Makan mie ayam hangat makin nikmat kalau ditemani es teh manis dingin yang segar atau semangkuk es teler legit."
                align="left"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {menuMinuman.map((item) => (
                <MenuCard
                  key={item.id}
                  name={item.nama}
                  description={item.deskripsi}
                  price={item.harga}
                  imageUrl={item.foto}
                  badge={item.badge}
                  isAvailable={item.isAvailable ?? true}
                  waNumber={kontak.wa}
                  variant="small"
                />
              ))}
            </div>
          </div>

        </div>

        <WaveDivider direction="bottom" color="#8B1E1E" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          e. KENAPA PILIH KAMI
          - Background merah bata (#8B1E1E), teks putih
          - 3 item dengan IconLine line-art 1 warna
          - Layout horizontal di desktop, vertikal di mobile
         ═══════════════════════════════════════════════════════════════ */}
      <section id="kenapa-kami" className="relative bg-[#8B1E1E] overflow-hidden">
        <WaveDivider direction="top" color="#FAF0E6" className="absolute top-0 left-0 right-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-28 sm:py-36">

          <div className="text-center mb-16">
            <SectionHeading
              eyebrow={copy.kenapaPilihKami.eyebrow}
              heading={copy.kenapaPilihKami.heading}
              headingAccent={copy.kenapaPilihKami.headingAccent}
              align="center"
              light
            />
          </div>

          {/* 3 Keunggulan (horizontal desktop, vertikal mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {copy.kenapaPilihKami.items.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-white/30 bg-white/5 flex items-center justify-center">
                  <IconLine icon={item.icon} size={30} color="#FFFFFF" />
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight mb-2">
                    {item.judul}
                  </h3>
                  <p className="text-red-100/85 font-sans text-sm leading-relaxed max-w-xs mx-auto">
                    {item.deskripsi}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        <WaveDivider direction="bottom" color="#FAF0E6" className="absolute bottom-0 left-0 right-0" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          f. GALERI
          - Grid 4 foto dengan 1 foto besar + 3 kecil
          - Hover: zoom subtle
         ═══════════════════════════════════════════════════════════════ */}
      <section id="galeri" className="bg-[#FAF0E6] py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-12">
            <SectionHeading
              eyebrow={copy.galeri.eyebrow}
              heading={copy.galeri.heading}
              headingAccent={copy.galeri.headingAccent}
              subheading={copy.galeri.subheading}
              align="center"
            />
          </div>

          {/* 1 foto besar (span 2 baris & 2 kolom) + 3 foto kecil */}
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] gap-3 sm:gap-4">
            {galeri[0] && (
              <div className="col-span-2 row-span-2 relative rounded-[12px] overflow-hidden bg-stone-900 group">
                <Image
                  src={galeri[0].src}
                  alt={galeri[0].alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}

            {galeri.slice(1, 4).map((foto, idx) => (
              <div key={idx} className="relative rounded-[12px] overflow-hidden bg-stone-900 group">
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>

        </div>

        <WaveDivider direction="bottom" color="#FAF0E6" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          g. TESTIMONI (Referensi Ulasan Google Maps & Pelanggan Nyata)
          - Background krem
          - Grid 2 kolom, quote mark besar sebagai aksen
         ═══════════════════════════════════════════════════════════════ */}
      {testimoni.length > 0 && (
        <section id="testimoni" className="bg-[#FAF0E6] py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
              <SectionHeading
                eyebrow={copy.testimoni.eyebrow}
                heading={copy.testimoni.heading}
                headingAccent={copy.testimoni.headingAccent}
                subheading={copy.testimoni.subheading}
                align="left"
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 pb-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#8B1E1E]/20 text-xs font-bold text-stone-800 shadow-sm">
                  <span className="text-amber-500 text-sm">★★★★★</span>
                  <span>5.0 / 5.0 Google Maps</span>
                </div>

                <a
                  href={kontak.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B1E1E] hover:text-[#6B1515] uppercase tracking-wider transition-colors"
                  aria-label="Lihat ulasan lengkap di Google Maps (buka di tab baru)"
                >
                  <span>Lihat di Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimoni.map((t, idx) => (
                <TestimonialCard
                  key={idx}
                  nama={t.nama}
                  teks={t.teks}
                  rating={t.rating}
                  asal={t.asal}
                  source="Ulasan Google Maps"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          h. LOKASI WARUNG (Tanpa Jam Operasional sesuai permintaan)
          - 2 kolom: Alamat & Kontak di kiri, Peta Interaktif di kanan
          - StampBadge "Klik untuk navigasi"
         ═══════════════════════════════════════════════════════════════ */}
      <section id="lokasi" className="bg-[#FAF0E6] py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-14">
            <SectionHeading
              eyebrow={copy.lokasi.eyebrow}
              heading={copy.lokasi.heading}
              headingAccent={copy.lokasi.headingAccent}
              subheading={copy.lokasi.subheading}
              align="center"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Kolom kiri (5 cols): Rincian Alamat & Kontak Langsung */}
            <div className="lg:col-span-5 bg-white rounded-[12px] p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between gap-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#8B1E1E] text-white flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-lg text-stone-900">
                        Alamat Warung
                      </h3>
                      <p className="text-xs text-stone-400">Sidoarjo, Jawa Timur</p>
                    </div>
                  </div>

                  <a
                    href={kontak.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Buka navigasi Google Maps (buka di tab baru)"
                    className="shrink-0 hover:scale-105 transition-transform"
                  >
                    <StampBadge
                      text={copy.lokasi.badgeNavigasi}
                      size={58}
                      bgColor="#8B1E1E"
                      borderColor="#FAF0E6"
                      textColor="#FAF0E6"
                    />
                  </a>
                </div>

                <div className="space-y-3 font-sans">
                  <p className="text-sm text-stone-700 leading-relaxed font-medium">
                    {kontak.alamat}
                  </p>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Lokasi strategis di perumahan Taman Pinang Indah. Tempatnya bersih, asri, dan tersedia area parkir aman untuk motor maupun mobil.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF0E6]/60 border border-[#8B1E1E]/15 space-y-2">
                  <div className="flex items-center gap-2 text-stone-800 font-bold text-xs uppercase tracking-wider">
                    <Phone className="w-3.5 h-3.5 text-[#8B1E1E]" aria-hidden="true" />
                    <span>Mau Mampir atau Pesan Antar?</span>
                  </div>
                  <p className="text-xs text-stone-600 font-sans">
                    Mau delivery ke rumah, tanya ketersediaan menu, atau pesan banyak untuk acara keluarga? Langsung chat kami di WhatsApp{" "}
                    <strong className="text-[#8B1E1E]">{kontak.waDisplay}</strong>, kami siap layani dengan senang hati!
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-100">
                <a
                  href={kontak.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buka navigasi di Google Maps (buka di tab baru)"
                  className="inline-flex items-center justify-center gap-2 bg-[#8B1E1E] hover:bg-[#6B1515] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-colors min-h-[44px]"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Buka di Google Maps</span>
                </a>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hubungi via WhatsApp (buka di tab baru)"
                  className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#8B1E1E] text-[#8B1E1E] hover:text-white border-2 border-[#8B1E1E] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-all duration-200 min-h-[44px]"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Chat WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Kolom kanan (7 cols): Embed Google Maps Interaktif */}
            <div className="lg:col-span-7 bg-white rounded-[12px] p-3 sm:p-4 border border-stone-200 shadow-sm flex flex-col justify-between">
              <div className="relative rounded-[8px] overflow-hidden h-[360px] sm:h-[420px] w-full border border-stone-100 bg-stone-100">
                <iframe
                  title="Peta Lokasi Mie Ayam Surabaya"
                  src={kontak.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="pt-3 px-2 flex items-center justify-between text-xs text-stone-500 font-sans">
                <span>Taman Pinang Indah, Sidoarjo</span>
                <span className="text-[11px] font-semibold text-[#8B1E1E]">Google Maps Interaktif</span>
              </div>
            </div>

          </div>
        </div>

        <WaveDivider direction="bottom" color="#8B1E1E" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          i. KONTAK / CTA SECTION
          - Background merah bata (#8B1E1E)
          - Teks putih besar "Pesan sekarang via WhatsApp"
          - Tombol pill putih dengan icon WA
         ═══════════════════════════════════════════════════════════════ */}
      <section id="kontak" className="bg-[#8B1E1E] py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">

          <h2 className="font-display text-4xl sm:text-6xl font-bold text-white uppercase tracking-tight leading-[0.95] mb-4">
            {copy.cta.heading}
            <br />
            <span className="text-[#F5E6D3]">{copy.cta.headingAccent}</span>
          </h2>

          <p className="text-red-100/90 font-sans text-base mb-8 max-w-md mx-auto leading-relaxed">
            {copy.cta.subteks}
          </p>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pesan via WhatsApp (buka di tab baru)"
            className="inline-flex items-center gap-3 bg-white text-[#8B1E1E] hover:bg-[#F5E6D3] font-bold text-base uppercase tracking-wider px-9 py-4 rounded-full transition-all duration-200 min-h-[52px] shadow-xl hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{copy.cta.tombolText}</span>
          </a>
        </div>
      </section>

    </div>
  );
}
