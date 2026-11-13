import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import StatusSign from "@/components/public/StatusSign";
import { formatRupiah } from "@/lib/utils";
import { MapPin, Clock, MessageCircle, ExternalLink, ArrowRight } from "lucide-react";

export const revalidate = 60;

// ── SAIGETSU Monoline Vector Graphics ─────────────────────────────────────
const MonolineWave = () => (
  <svg
    viewBox="0 0 240 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto text-[#BA382A]"
    aria-hidden="true"
  >
    <path
      d="M10 130 C40 130 55 90 75 90 C95 90 105 115 130 115 C155 115 170 70 195 70 C215 70 225 90 235 90"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M5 110 C30 110 45 60 70 60 C90 60 100 85 125 85 C150 85 165 40 190 40 C210 40 220 60 235 60"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M15 90 C35 90 50 35 75 35 C95 35 105 60 130 60 C155 60 170 15 195 15 C215 15 225 35 235 35"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="68" cy="20" r="3" fill="currentColor" />
    <circle cx="120" cy="45" r="2.5" fill="currentColor" />
    <circle cx="185" cy="8" r="3.5" fill="currentColor" />
    <circle cx="160" cy="50" r="2" fill="currentColor" />
  </svg>
);

const MonolineChopsticksNoodle = () => (
  <svg
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-14 h-14 text-[#BA382A]"
    aria-hidden="true"
  >
    <path
      d="M12 36 Q12 60 36 60 Q60 60 60 36 Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="8" y1="36" x2="64" y2="36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="24" y1="64" x2="48" y2="64" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="12" x2="52" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="20" y1="8" x2="56" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M36 22 Q40 28 36 36 Q32 44 38 48"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M44 25 Q48 30 42 36 Q38 42 44 46"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MonolineFloralCrest = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-12 h-12 text-[#BA382A]"
    aria-hidden="true"
  >
    <circle cx="32" cy="32" r="5" stroke="currentColor" strokeWidth="2" />
    <path d="M32 27 C28 17 36 17 32 27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M36.7 30.4 C46.2 25.5 48.7 33.1 36.7 30.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M35 36 C41 44 34.5 49 35 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M29 36 C23 44 29.5 49 29 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M27.3 30.4 C17.8 25.5 15.3 33.1 27.3 30.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default async function HomePage() {
  const [profile, status, featuredItems, schedule] = await Promise.all([
    prisma.storeProfile.findFirst(),
    prisma.storeStatus.findFirst(),
    prisma.menuItem.findMany({
      where: { isFeatured: true },
      take: 4,
      orderBy: { order: "asc" },
      include: { category: true },
    }),
    prisma.operatingSchedule.findMany({ orderBy: { dayOfWeek: "asc" } }),
  ]);

  const todayDOW = new Date().getDay();
  const wa = profile?.whatsappNumber || "6282319195854";

  return (
    <div className="bg-white">

      {/* ════════════════════════════════════════════════════════════════
          1. HERO SECTION (Saigetsu Slide 1 Presentation)
             Porcelain Ivory Canvas, Monoline Crest, Monoline Ocean Waves,
             Condensed Display Title, Integrated Status Sign, Circular Dish Mask
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center bg-[#FAF8F5] border-b border-stone-200 overflow-hidden pt-28 pb-20">

        {/* Top-Right Monoline Floral Crest */}
        <div className="absolute top-10 right-10 opacity-70 pointer-events-none hidden sm:block">
          <MonolineFloralCrest />
        </div>

        {/* Bottom-Left Monoline Waves */}
        <div className="absolute -bottom-6 -left-6 w-72 sm:w-80 opacity-40 pointer-events-none">
          <MonolineWave />
        </div>

        {/* Circular Arc Graphic Accent */}
        <div
          className="absolute right-[-100px] top-[20%] w-[380px] h-[380px] rounded-full border-2 border-[#BA382A]/20 pointer-events-none hidden lg:block"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-6xl mx-auto w-full px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">

            {/* Left Column (Editorial Typography) */}
            <div className="space-y-6">

              {/* Chopsticks & Noodle Monoline Icon */}
              <div className="flex items-center gap-3">
                <MonolineChopsticksNoodle />
                <div className="h-8 w-px bg-stone-200" />
                <div className="flex items-center gap-2">
                  <span className="saigetsu-stamp">東方</span>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#BA382A] font-bold">
                    Authentic Oriental Noodles
                  </span>
                </div>
              </div>

              {/* Main Heading (Oswald Condensed Bold) */}
              <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-stone-900 uppercase leading-[0.92]">
                MIE AYAM<br />
                <span className="text-[#BA382A]">SURABAYA</span>
              </h1>

              {/* Asian Subtitle Line */}
              <div className="flex items-center gap-2.5 text-stone-700">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-500">
                  Cita Rasa Khas Oriental Sidoarjo
                </span>
                <span className="text-stone-300">·</span>
                <span className="text-xs font-bold text-stone-700">東方風味</span>
              </div>

              {/* Description */}
              <p className="text-stone-600 font-sans text-base sm:text-lg leading-relaxed max-w-lg">
                {profile?.shortDescription ||
                  "Menyajikan mie ayam bergaya oriental dengan bumbu khas meresap, tekstur mie kenyal autentik, dan topping daging ayam melimpah."}
              </p>

              {/* Live Status Operasional (Tasteful & Non-Slop) */}
              <div className="pt-1">
                <StatusSign
                  initialData={{
                    isOpen: status?.isOpen ?? true,
                    statusNote: status?.statusNote ?? null,
                    nextOpenText: status?.nextOpenText ?? null,
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-1">
                <a
                  href={`https://wa.me/${wa}?text=Halo%2C%20saya%20ingin%20memesan%20Mie%20Ayam.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-saigetsu text-sm uppercase tracking-wider"
                  aria-label="Pesan via WhatsApp (buka di tab baru)"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Pesan via WhatsApp</span>
                </a>
                <Link
                  href="/menu"
                  className="btn-saigetsu-outline text-sm uppercase tracking-wider"
                  aria-label="Lihat daftar menu lengkap dan harga"
                >
                  <span>Lihat Daftar Menu</span>
                </Link>
              </div>
            </div>

            {/* Right Column (Saigetsu Signature Circular Framing) */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                {/* Semicircular Terracotta Backing Arc */}
                <div
                  className="absolute -top-4 -right-4 w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-[#BA382A] pointer-events-none"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 100%)",
                  }}
                  aria-hidden="true"
                />

                {/* Circular Mask with Red Ring holding the authentic dish photo */}
                <div className="relative w-60 h-60 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-[#BA382A] shadow-xl bg-white p-2">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src="/images/fotomie.png"
                      alt="Semangkuk Mie Ayam Oriental Komplit dengan Pangsit dan Kuah Kaldu"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      priority
                      sizes="(max-width: 640px) 240px, 320px"
                    />
                  </div>
                </div>

                {/* Overlapping Badge Pill */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#BA382A] text-white px-5 py-2 rounded-full shadow-md text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                  100% Halal & Gurih
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════
          2. THE 3 VERTICAL ASIAN PILLARS (Saigetsu Slide 2 & 4)
             Solid Terracotta, Wine & Warm Ochre Pillars
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Text Block (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2">
              <span className="saigetsu-stamp">故事</span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#BA382A] font-bold">
                Cerita Kami
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 uppercase leading-[0.95]">
              Cita Rasa yang<br />
              <span className="text-[#BA382A]">Beda Dari Biasa</span>
            </h2>
            <div className="w-16 h-1 bg-[#BA382A] rounded-full" />
            <p className="text-stone-600 font-sans text-sm sm:text-base leading-relaxed">
              {profile?.story ||
                "Mie Ayam Surabaya menyajikan mie ayam bergaya oriental dengan bumbu khas yang meresap sempurna. Daging ayam gurih, mie kenyal harian, dan kuah kaldu hangat menjadi racikan favorit penikmat kuliner di Sidoarjo."}
            </p>
            <div className="pt-2">
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#BA382A] hover:text-[#8B1E1E] transition-colors uppercase tracking-wider group"
                aria-label="Baca perjalanan lengkap usaha kami"
              >
                <span>Baca Perjalanan Kami</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right: The 3 Vertical Asian Pillar Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Pillar 1: Deep Wine */}
            <div className="bg-[#8B1E1E] text-white rounded-2xl p-6 flex flex-col justify-between min-h-[220px] shadow-sm">
              <div className="flex justify-between items-start">
                <span className="font-display text-4xl font-bold opacity-30 select-none">
                  01
                </span>
                <span className="text-3xl font-bold opacity-90">麵</span>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-red-200 font-semibold mb-1">
                  Tekstur Otentik
                </p>
                <h3 className="font-display text-xl font-bold uppercase leading-tight mb-2">
                  Mie Kenyal Pas
                </h3>
                <p className="text-xs text-red-100/80 leading-relaxed font-sans">
                  Mie olahan segar harian tanpa pengawet dengan kekenyalan khas oriental.
                </p>
              </div>
            </div>

            {/* Pillar 2: Signature Terracotta Red */}
            <div className="bg-[#BA382A] text-white rounded-2xl p-6 flex flex-col justify-between min-h-[220px] shadow-sm">
              <div className="flex justify-between items-start">
                <span className="font-display text-4xl font-bold opacity-30 select-none">
                  02
                </span>
                <span className="text-3xl font-bold opacity-90">香</span>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-red-200 font-semibold mb-1">
                  Racikan Spesial
                </p>
                <h3 className="font-display text-xl font-bold uppercase leading-tight mb-2">
                  Bumbu Meresap
                </h3>
                <p className="text-xs text-red-100/80 leading-relaxed font-sans">
                  Bumbu oriental yang gurih mendalam berpadu minyak rempah wangi.
                </p>
              </div>
            </div>

            {/* Pillar 3: Warm Ochre */}
            <div className="bg-[#D97330] text-white rounded-2xl p-6 flex flex-col justify-between min-h-[220px] shadow-sm">
              <div className="flex justify-between items-start">
                <span className="font-display text-4xl font-bold opacity-30 select-none">
                  03
                </span>
                <span className="text-3xl font-bold opacity-90">濃</span>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-orange-200 font-semibold mb-1">
                  Topping Melimpah
                </p>
                <h3 className="font-display text-xl font-bold uppercase leading-tight mb-2">
                  Ayam & Pangsit
                </h3>
                <p className="text-xs text-orange-100/80 leading-relaxed font-sans">
                  Potongan ayam tebal, bakso sapi kenyal, dan pangsit renyah gurih.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════
          3. FEATURED MENU SHOWCASE (Saigetsu Slide 5)
             Red Terracotta Banner with Double Frame,
             Followed by Clean Dotted Menu Cards with Real Dish Photos
         ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#FAF8F5] border-y border-stone-200 py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Saigetsu Red Showcase Banner */}
          <div className="relative bg-[#BA382A] text-white rounded-2xl p-8 sm:p-12 overflow-hidden shadow-lg">
            <div className="absolute inset-3 sm:inset-4 border border-white/20 rounded-xl pointer-events-none" aria-hidden="true" />
            
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-white text-[#BA382A] px-2 py-0.5 text-xs font-bold rounded-sm tracking-wider">
                  SELEKSI RESMI
                </span>
                <span className="text-xs uppercase tracking-widest text-red-100 font-semibold">
                  Menu Pilihan Favorit
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95]">
                PILIHAN UTAMA<br />
                MIE AYAM SURABAYA
              </h2>
              <p className="text-sm sm:text-base text-red-100 leading-relaxed font-sans pt-1">
                Disajikan panas langsung dari kuali dengan kaldu gurih harum dan bumbu oriental khas.
              </p>
            </div>
          </div>

          {/* Grid of Featured Items with Aesthetic Dish Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredItems.map((item) => {
              const waLink = `https://wa.me/${wa}?text=Halo%2C%20saya%20ingin%20pesan%20${encodeURIComponent(item.name)}.`;
              const imageSrc = item.imageUrl || "/images/menu/mie-komplit.png";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col justify-between gap-5 hover:border-[#BA382A]/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Dish Photo Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-stone-50 shadow-xs">
                      <Image
                        src={imageSrc}
                        alt={item.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 80px, 96px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] tracking-widest uppercase font-bold text-stone-400">
                          {item.category.name}
                        </span>
                        {item.badge && (
                          <span className="badge-saigetsu">{item.badge}</span>
                        )}
                      </div>
                      <h3 className="font-sans text-lg sm:text-xl font-bold text-stone-900 leading-tight mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-sans leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <span className="font-display text-2xl font-bold text-[#BA382A]">
                      {formatRupiah(item.price)}
                    </span>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-saigetsu text-xs uppercase tracking-wider py-2 px-4"
                      aria-label={`Pesan ${item.name} via WhatsApp (buka di tab baru)`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Pesan</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Menu CTA */}
          <div className="text-center pt-4">
            <Link
              href="/menu"
              className="btn-saigetsu-outline text-sm uppercase tracking-wider inline-flex"
              aria-label="Lihat seluruh daftar menu makanan dan minuman"
            >
              Lihat Daftar Menu Lengkap & Harga
            </Link>
          </div>

        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════
          4. 3 PILAR KUALITAS & CONNECTED STEPPER (Saigetsu Slide 6)
             Horizontal Stepper with Arching Arc
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <div className="flex items-center justify-center gap-2">
            <span className="saigetsu-stamp">品質</span>
            <span className="text-xs uppercase tracking-[0.2em] text-[#BA382A] font-bold">
              Standar Kami
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 uppercase">
            3 Pilar Kualitas Kami
          </h2>
          <p className="text-sm text-stone-500 max-w-lg mx-auto font-sans">
            Menjaga standar cita rasa oriental terbaik dalam setiap porsi yang disajikan ke meja Anda.
          </p>
        </div>

        {/* Stepper Timeline with Connecting Line */}
        <div className="relative mb-12 hidden md:block">
          <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-stone-200 -translate-y-1/2" />
          <div
            className="absolute top-[-30px] right-[10%] w-32 h-24 rounded-t-full border-t-2 border-r-2 border-[#BA382A] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative flex justify-around items-center">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className="w-12 h-12 rounded-full bg-[#BA382A] text-white flex items-center justify-center font-display text-lg font-bold shadow-md"
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* 3 Quality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-stone-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-white border border-[#BA382A] text-[#BA382A] flex items-center justify-center font-bold text-sm mx-auto shadow-sm">
              01
            </div>
            <h3 className="font-sans font-bold text-lg text-stone-900">
              Bumbu Oriental Asli
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              Racikan bumbu tradisional khas oriental dengan kecap pilihan dan minyak bawang wangi buatan sendiri.
            </p>
          </div>

          <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-stone-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-white border border-[#BA382A] text-[#BA382A] flex items-center justify-center font-bold text-sm mx-auto shadow-sm">
              02
            </div>
            <h3 className="font-sans font-bold text-lg text-stone-900">
              Bahan Segar Harian
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              Daging ayam, sayuran hijau segar, bakso sapi, dan pangsit renyah diproses baru setiap hari tanpa sisa kemarin.
            </p>
          </div>

          <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-stone-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-white border border-[#BA382A] text-[#BA382A] flex items-center justify-center font-bold text-sm mx-auto shadow-sm">
              03
            </div>
            <h3 className="font-sans font-bold text-lg text-stone-900">
              Harga Warung Keluarga
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              Kualitas rasa standar restoran dengan harga yang terjangkau untuk dinikmati seluruh anggota keluarga.
            </p>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════
          5. JADWAL OPERASIONAL & LOKASI WARUNG
             Clean geometric cards with today highlighted & map directions
         ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#FAF8F5] border-t border-stone-200 py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-10">

          <div className="text-center space-y-2">
            <span className="saigetsu-stamp">地點</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 uppercase">
              Jadwal & Lokasi
            </h2>
            <p className="text-sm text-stone-500 font-sans">
              Kunjungi warung kami langsung di Sidoarjo atau pesan antar ke rumah Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Operating Schedule Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-[#FDF2F0] text-[#BA382A] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-stone-900">
                    Jam Operasional
                  </h3>
                  <p className="text-xs text-stone-400">Buka seminggu penuh</p>
                </div>
              </div>

              <div className="space-y-1.5 font-sans text-xs sm:text-sm">
                {schedule.map((s) => {
                  const today = s.dayOfWeek === todayDOW;
                  return (
                    <div
                      key={s.id}
                      className={`flex justify-between items-center px-3.5 py-2.5 rounded-xl transition-colors ${
                        today
                          ? "bg-[#FDF2F0] font-bold text-[#BA382A]"
                          : "text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {s.dayName}
                        {today && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#BA382A] text-white">
                            Hari Ini
                          </span>
                        )}
                      </span>
                      <span>
                        {s.isClosed ? "Tutup" : `${s.openTime} sampai ${s.closeTime} WIB`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location & Map Direction Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                  <div className="w-10 h-10 rounded-xl bg-[#FDF2F0] text-[#BA382A] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-lg text-stone-900">
                      Alamat Warung
                    </h3>
                    <p className="text-xs text-stone-400">Sidoarjo, Jawa Timur</p>
                  </div>
                </div>

                <p className="text-sm text-stone-700 leading-relaxed font-sans">
                  {profile?.address ||
                    "Jl. Raya Taman Pinang Indah, Jetis, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61213"}
                </p>

                <p className="text-xs text-stone-500 font-sans">
                  Lokasi strategis di kawasan perumahan Taman Pinang Indah. Parkir mudah dan tersedia area makan yang nyaman.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-stone-100">
                <a
                  href={
                    profile?.mapsUrl ||
                    "https://www.google.com/maps/place/MIE+AYAM+SURABAYA"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-saigetsu text-xs uppercase tracking-wider py-2.5 px-4"
                  aria-label="Buka lokasi di Google Maps (buka di tab baru)"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Buka di Google Maps</span>
                </a>
                <Link
                  href="/lokasi"
                  className="btn-saigetsu-outline text-xs uppercase tracking-wider py-2.5 px-4"
                  aria-label="Lihat rincian petunjuk arah di halaman lokasi"
                >
                  Detail Petunjuk Arah
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
