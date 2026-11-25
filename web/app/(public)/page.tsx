import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site.config";
import StatusBadge from "@/components/public/StatusBadge";
import SectionHeading from "@/components/public/SectionHeading";
import MenuCarousel from "@/components/public/MenuCarousel";
import TestimonialCarousel from "@/components/public/TestimonialCarousel";
import GalleryCarousel from "@/components/public/GalleryCarousel";
import ScrollReveal from "@/components/public/ScrollReveal";
import StampBadge from "@/components/public/StampBadge";
import { ChineseKnotDivider } from "@/components/public/ChineseOrnaments";
import {
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  Clock,
  Instagram,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const revalidate = 60;

export default function HomePage() {
  const { copy, kontak, sosmed, menuMakanan, menuMinuman, testimoni, statusBuka } =
    siteConfig;

  const waLink = `https://wa.me/${kontak.wa}?text=Halo%20${encodeURIComponent(
    siteConfig.brandName
  )}%2C%20saya%20ingin%20memesan.`;

  return (
    <div className="bg-[#FAF7F2] text-[#2C1810] overflow-x-hidden">

      {/* ── 1. HERO: Full-Bleed Editorial with Ken Burns Zoom & Dish Preview ── */}
      <section
        id="beranda"
        className="relative min-h-[92svh] sm:min-h-[96svh] flex flex-col justify-end overflow-hidden pt-24"
      >
        {/* Background photo with subtle, smooth zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/1.png"
            alt="Suasana Warung Mie Ayam Surabaya"
            fill
            className="object-cover object-center animate-zoom-bg"
            priority
            sizes="100vw"
          />

          {/* Overlay merah rgba(160, 20, 20, 0.55) agar foto warung tetap hidup & teks kontras */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(160, 20, 20, 0.55)" }}
          />
          {/* Gradasi lembut tambahan untuk keterbacaan teks */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        </div>

        {/* Hero Content Area */}
        <div className="relative z-20 max-w-6xl mx-auto w-full px-5 sm:px-8 pb-14 sm:pb-20 pt-20">
          <div className="max-w-2xl">
            {/* Status Highlight: Open / Closed */}
            <div className="mb-4 animate-fade-in delay-100">
              <StatusBadge isOpen={statusBuka} />
            </div>

            {/* Main Headline: Fraunces Bold dengan fade-in 1.2s ease-out */}
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.02] mb-5 animate-hero-title">
              {copy.hero.heading}{" "}
              <span className="text-[#FFD700]">{copy.hero.headingAccent}</span>
            </h1>

            {/* Subtitle text: DM Sans Medium */}
            <p className="section-subheading-unified text-[#FFF8E7]/90 leading-relaxed mb-8 max-w-xl animate-fade-up delay-200">
              {copy.hero.subteks}
            </p>

            {/* CTA Utama (WhatsApp Order) */}
            <div className="flex flex-wrap items-center gap-4 animate-fade-up delay-300">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-xs uppercase tracking-wider px-8 py-3.5 min-h-[46px] shadow-lg shadow-[#D4AF37]/30"
                aria-label="Pesan via WhatsApp (Buka di tab baru)"
              >
                <MessageCircle className="w-4 h-4 shrink-0 text-[#8B0000]" aria-hidden="true" />
                <span>{copy.hero.ctaWa}</span>
              </a>

              <a
                href="#menu"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-white/90 hover:text-[#FFD700] px-5 py-3 transition-colors"
              >
                <span>Lihat Sajian Pilihan</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Gradasi 160px menempel di dasar hero: transparan -> krem (#FAF7F2) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[160px] pointer-events-none z-10"
          style={{
            background: "linear-gradient(to bottom, transparent, #FAF7F2)",
          }}
          aria-hidden="true"
        />
      </section>

      {/* ── 2. MENU SECTION (Interactive Carousel on Cohesive #FAF7F2 Canvas) ── */}
      <section id="menu" className="py-16 sm:py-24 bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <ScrollReveal animation="slideUp">
            <div className="text-center mb-12">
              <SectionHeading
                eyebrow={copy.menu.eyebrow}
                heading="MENU KAMI"
                headingAccent="Autentik & Gurih"
                subheading={copy.menu.subheading}
                align="center"
                showKnot
              />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="slideUp" delay={120}>
            <MenuCarousel
              makanan={menuMakanan}
              minuman={menuMinuman}
              waNumber={kontak.wa}
            />
          </ScrollReveal>

          <div className="mt-12 text-center">
            <ScrollReveal animation="scale" delay={200}>
              <Link
                href="/menu"
                className="btn-red-gold text-xs uppercase tracking-wider px-8 py-3.5 shadow-md"
              >
                <span>Lihat Daftar Menu Lengkap</span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 3. FILOSOFI & KEUNGGULAN SAJIAN (Inspirasi The Noodle Way & Spring by China Mama) ── */}
      <section id="keunggulan" className="py-16 sm:py-20 bg-[#FAF7F2] border-t border-stone-200/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <ScrollReveal animation="slideUp">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <p className="section-eyebrow-unified text-[#9A6B00] mb-2">Filosofi Dapur Kami</p>
              <h2 className="section-heading-unified text-[#2C1810]">
                Sentuhan Rasa <span className="text-[#8B0000]">Otentik & Jujur</span>
              </h2>
              <ChineseKnotDivider variant="dark" className="my-4" />
              <p className="section-subheading-unified text-[#6B4423]">
                Kami menjaga mutu semangkuk mie dari pemilihan tepung, racikan kaldu murni, hingga potongan daging ayam berbumbu rempah meresap.
              </p>
            </div>
          </ScrollReveal>

          {/* 3 Airy Craft Pillars (Bukan card kotak template AI, melainkan editorial pillars) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pt-4">
            <ScrollReveal animation="slideUp" delay={80}>
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 pb-6 md:pb-0 md:border-r md:border-stone-200/80 md:pr-8">
                <span className="font-heading text-sm font-bold tracking-widest text-[#8B0000] uppercase">
                  01 / Mie Kenyal Alami
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#2C1810]">
                  Giling Segar Tiap Pagi
                </h3>
                <p className="section-body-unified text-[#6B4423] leading-relaxed">
                  Adonan mie kami buat langsung setiap pagi tanpa bahan pengawet. Teksturnya kenyal pas, lembut alami saat dikunyah, dan tidak gampang lembek.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slideUp" delay={160}>
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 pb-6 md:pb-0 md:border-r md:border-stone-200/80 md:pr-8">
                <span className="font-heading text-sm font-bold tracking-widest text-[#8B0000] uppercase">
                  02 / Kaldu Sapi Murni
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#2C1810]">
                  Rebusan Kaldu Gurih
                </h3>
                <p className="section-body-unified text-[#6B4423] leading-relaxed">
                  Dimasak perlahan dari sari tulang sapi dan rempah aromatik alami. Menghasilkan kuah kaldu bening yang gurih, harum, dan menenangkan perut.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slideUp" delay={240}>
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                <span className="font-heading text-sm font-bold tracking-widest text-[#8B0000] uppercase">
                  03 / 100% Halal & Bersih
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#2C1810]">
                  Porsi Puas & Higienis
                </h3>
                <p className="section-body-unified text-[#6B4423] leading-relaxed">
                  Seluruh bahan dijamin halal dan diproses di dapur terbuka yang bersih. Topping ayam gurih manisnya melimpah, dipadu sawi hijau segar dan pangsit renyah.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 4. TENTANG KAMI: Editorial Heritage Story with Circular Stamp Seal ── */}
      <section id="tentang" className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-stone-200/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left Column: Story & Metrics */}
            <div className="lg:col-span-6 space-y-5">
              <ScrollReveal animation="slideLeft">
                <SectionHeading
                  eyebrow={copy.tentang.eyebrow}
                  heading={copy.tentang.heading}
                  headingAccent={copy.tentang.headingAccent}
                  align="left"
                />
              </ScrollReveal>

              <ScrollReveal animation="slideLeft" delay={100}>
                <p className="section-body-unified text-[#2C1810]">
                  {copy.tentang.p1}
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slideLeft" delay={180}>
                <p className="section-body-unified text-[#6B4423]">
                  {copy.tentang.p2}
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slideUp" delay={240}>
                <div className="grid grid-cols-3 gap-4 pt-5 border-t border-stone-300/70">
                  <div>
                    <p className="font-heading text-2xl sm:text-3xl font-bold text-[#8B0000]">2024</p>
                    <p className="section-body-unified text-xs text-[#6B4423] mt-0.5">Tahun Berdiri</p>
                  </div>
                  <div className="border-l border-stone-300/70 pl-4">
                    <p className="font-heading text-2xl sm:text-3xl font-bold text-[#8B0000]">100%</p>
                    <p className="section-body-unified text-xs text-[#6B4423] mt-0.5">Halal & Mie Segar</p>
                  </div>
                  <div className="border-l border-stone-300/70 pl-4">
                    <p className="font-heading text-2xl sm:text-3xl font-bold text-[#8B0000]">5.0 ★</p>
                    <p className="section-body-unified text-xs text-[#6B4423] mt-0.5">Ulasan Google Maps</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="scale" delay={300}>
                <div className="pt-2">
                  <Link
                    href="/tentang"
                    className="btn-red-gold text-xs uppercase tracking-wider px-6 py-3"
                  >
                    <span>Baca Cerita Lengkap</span>
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Photo Collage with Authentic Stamp Seal */}
            <div className="lg:col-span-6 relative">
              <ScrollReveal animation="slideRight" delay={150}>
                <div className="grid grid-cols-12 gap-3 sm:gap-4">
                  <div className="col-span-7">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-100 border border-stone-200 shadow-md group">
                      <Image
                        src="/images/1.png"
                        alt={`Suasana Warung ${siteConfig.brandName}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 1024px) 60vw, 30vw"
                      />
                    </div>
                  </div>

                  <div className="col-span-5 flex flex-col gap-3 sm:gap-4">
                    <div className="flex-1 relative">
                      <div className="relative w-full h-full min-h-[140px] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm group">
                        <Image
                          src="/images/2.png"
                          alt={`Area makan ${siteConfig.brandName}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          sizes="(max-width: 1024px) 40vw, 20vw"
                        />
                      </div>
                    </div>

                    <div className="flex-1 relative">
                      <div className="relative w-full h-full min-h-[140px] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm group">
                        <Image
                          src="/images/3.png"
                          alt={`Tampak warung ${siteConfig.brandName}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          sizes="(max-width: 1024px) 40vw, 20vw"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. GALERI SAJIAN & SUASANA WARUNG (Dedicated Swipeable Carousel) ── */}
      <section id="galeri" className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-stone-200/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <ScrollReveal animation="slideUp">
            <div className="text-center mb-12">
              <SectionHeading
                eyebrow={copy.galeri.eyebrow}
                heading={copy.galeri.heading}
                headingAccent={copy.galeri.headingAccent}
                subheading={copy.galeri.subheading}
                align="center"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="scale" delay={120}>
            <GalleryCarousel items={siteConfig.galeri} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 6. TESTIMONI PELANGGAN (Google Maps Direct Link & Carousel) ── */}
      {testimoni.length > 0 && (
        <section id="testimoni" className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-stone-200/60">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <ScrollReveal animation="slideUp">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <SectionHeading
                  eyebrow={copy.testimoni.eyebrow}
                  heading={copy.testimoni.heading}
                  headingAccent={copy.testimoni.headingAccent}
                  subheading={copy.testimoni.subheading}
                  align="left"
                />

                <div className="flex flex-wrap items-center gap-3 shrink-0 pb-1">
                  <a
                    href={kontak.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-300 text-xs font-bold text-[#2C1810] shadow-sm hover:border-[#D4AF37] hover:shadow-md transition-all duration-300"
                    aria-label="Lihat ulasan rating Google Maps (Buka di tab baru)"
                  >
                    <span className="text-[#D4AF37] text-sm" aria-hidden="true">★★★★★</span>
                    <span>5.0 / 5.0 Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#8B0000]" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Testimonials Swipeable Carousel with desktop arrows & dot indicators */}
            <ScrollReveal animation="slideUp" delay={120}>
              <TestimonialCarousel
                testimoni={testimoni}
                mapsUrl={kontak.mapsLink}
              />
            </ScrollReveal>

            <div className="mt-10 text-center">
              <ScrollReveal animation="scale" delay={180}>
                <a
                  href={kontak.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#8B0000] hover:text-[#C41E3A] uppercase tracking-wider transition-colors py-2 px-4 border-b border-[#8B0000]/40 hover:border-[#C41E3A]"
                >
                  <span>Buka Semua Ulasan di Google Maps</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* ── 7. JAM BUKA & ALAMAT (Minimalist Dark Layout matching user reference) ── */}
      <section id="lokasi" className="py-20 sm:py-28 bg-[#181110] text-[#FFF8E7] relative overflow-hidden">
        {/* Subtle decorative radial glow in background */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#C41E3A]/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Heading, Info & Red Pill CTA */}
            <div className="lg:col-span-5 space-y-6">
              <ScrollReveal animation="slideLeft">
                <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
                  Jam Buka & <br />
                  <span className="text-[#D4AF37]">Alamat</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal animation="slideLeft" delay={100}>
                <div className="space-y-4 pt-1">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1">
                      Alamat
                    </p>
                    <p className="text-[#FFF8E7]/90 text-sm sm:text-base leading-relaxed">
                      {kontak.alamat}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1">
                      Jam Operasional
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <span className="font-semibold text-white">Selasa – Minggu: 13.00 – Habis</span>
                      <span className="text-white/40">•</span>
                      <span className="text-rose-400 font-medium">Senin Libur</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#FFF8E7]/60 pt-2">
                    Cari &ldquo;Mie Ayam Surabaya&rdquo; di Google Maps, atau buka rutenya langsung dari sini.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="slideLeft" delay={180}>
                <div className="pt-2">
                  <a
                    href={kontak.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Buka di Google Maps (buka di tab baru)"
                    className="inline-flex items-center gap-2.5 bg-[#C41E3A] hover:bg-[#8B0000] text-white font-medium text-sm sm:text-base px-7 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-950/40 hover:-translate-y-0.5 group"
                  >
                    <span>Buka di Google Maps</span>
                    <span className="text-lg leading-none group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Clean Embedded Google Maps with Rounded Corners */}
            <div className="lg:col-span-7">
              <ScrollReveal animation="slideRight" delay={120}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 h-[340px] sm:h-[420px] w-full bg-stone-900">
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
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. TERIMA PESANAN / LAPAR? CHAT AJA (Sleek Minimalist Dark CTA) ── */}
      <section id="kontak" className="py-20 sm:py-24 bg-[#140D0C] text-[#FFF8E7] border-t border-white/10 relative overflow-hidden">
        {/* Subtle decorative radial glow in background */}
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-[#C41E3A]/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column: Headline, Copy & WhatsApp Pill Button */}
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal animation="slideLeft">
                <div className="space-y-3">
                  <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                    Lapar? <span className="text-[#D4AF37]">Chat Aja</span>
                  </h2>
                  <p className="text-[#FFF8E7]/80 text-sm sm:text-base max-w-lg leading-relaxed">
                    Pesan untuk makan di tempat, bungkus, atau antar ke rumah lewat WhatsApp.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="slideLeft" delay={120}>
                <div className="pt-2">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Chat WhatsApp ${kontak.waDisplay} (Buka di tab baru)`}
                    className="inline-flex items-center gap-3 bg-[#C41E3A] hover:bg-[#8B0000] text-white font-medium text-sm sm:text-base px-7 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-950/40 hover:-translate-y-0.5 group"
                  >
                    <MessageCircle className="w-5 h-5 text-white shrink-0 fill-current" aria-hidden="true" />
                    <span>Chat {kontak.waDisplay}</span>
                  </a>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Clean Link Rows with Top/Bottom Borders */}
            <div className="lg:col-span-5">
              <ScrollReveal animation="slideRight" delay={150}>
                <div className="flex flex-col border-y border-white/10 divide-y divide-white/10">
                  <a
                    href={kontak.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Buka rute di Google Maps (Buka di tab baru)"
                    className="flex items-center justify-between py-4 sm:py-5 text-[#FFF8E7]/90 hover:text-[#FFD700] transition-colors group"
                  >
                    <div className="flex items-center gap-3.5">
                      <MapPin className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform shrink-0" aria-hidden="true" />
                      <span className="text-sm sm:text-base font-medium">Buka rute di Google Maps</span>
                    </div>
                    <span className="text-lg leading-none text-white/50 group-hover:text-[#FFD700] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-all" aria-hidden="true">
                      ↗
                    </span>
                  </a>

                  <a
                    href={sosmed.igUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram ${sosmed.ig} (Buka di tab baru)`}
                    className="flex items-center justify-between py-4 sm:py-5 text-[#FFF8E7]/90 hover:text-[#FFD700] transition-colors group"
                  >
                    <div className="flex items-center gap-3.5">
                      <Instagram className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform shrink-0" aria-hidden="true" />
                      <span className="text-sm sm:text-base font-medium">Instagram {sosmed.ig}</span>
                    </div>
                    <span className="text-lg leading-none text-white/50 group-hover:text-[#FFD700] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-all" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
