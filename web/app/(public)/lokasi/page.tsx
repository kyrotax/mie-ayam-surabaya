import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { MapPin, Phone, Instagram, Clock, ExternalLink, MessageCircle } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Lokasi & Jam Buka",
  description:
    "Lokasi warung Mie Ayam Surabaya di Taman Pinang Indah, Sidoarjo. Petunjuk arah Google Maps, jam buka, dan kontak WhatsApp.",
};

export default async function LokasiPage() {
  const [profile, schedule] = await Promise.all([
    prisma.storeProfile.findFirst(),
    prisma.operatingSchedule.findMany({
      orderBy: { dayOfWeek: "asc" },
    }),
  ]);

  const todayDay = new Date().getDay();

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-28 pb-24">
      {/* Header Banner */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border-4 border-[#BA382A]/15 pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="saigetsu-stamp">位置</span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#BA382A] font-bold">
                Kunjungi Warung Kami
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-stone-900 uppercase leading-[0.95]">
              LOKASI & JAM BUKA
            </h1>
            <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
              Temukan lokasi warung Mie Ayam Surabaya di Taman Pinang Indah, Sidoarjo, atau pesan langsung via online.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Address Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF2F0] text-[#BA382A] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-stone-900">
                    Alamat Lengkap
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed font-sans">
                    {profile?.address ||
                      "Jl. Raya Taman Pinang Indah, Jetis, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61213"}
                  </p>
                </div>
              </div>

              <a
                href={
                  profile?.mapsUrl ||
                  "https://www.google.com/maps/place/MIE+AYAM+SURABAYA,+Jl.+Raya+Taman+Pinang+Indah"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="btn-saigetsu w-full justify-center text-xs uppercase tracking-wider py-2.5 font-bold"
                aria-label="Buka di Google Maps (buka di tab baru)"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Buka di Google Maps</span>
              </a>
            </div>

            {/* Official Contacts */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-sans font-bold text-lg text-stone-900">
                Kontak Resmi
              </h3>
              <div className="space-y-2.5 font-sans text-xs sm:text-sm">
                <a
                  href={`https://wa.me/${profile?.whatsappNumber || "6282319195854"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-[#FDF2F0] text-stone-700 hover:text-[#BA382A] transition-colors"
                  aria-label="WhatsApp 0823-1919-5854 (buka di tab baru)"
                >
                  <Phone className="w-4 h-4 text-[#BA382A] shrink-0" aria-hidden="true" />
                  <span className="flex-1 font-semibold">0823-1919-5854</span>
                  <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    WhatsApp
                  </span>
                </a>
                <a
                  href={profile?.instagramUrl || "https://www.instagram.com/mieayamsurabaya_/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-[#FDF2F0] text-stone-700 hover:text-[#BA382A] transition-colors"
                  aria-label="Instagram @mieayamsurabaya_ (buka di tab baru)"
                >
                  <Instagram className="w-4 h-4 text-[#BA382A] shrink-0" aria-hidden="true" />
                  <span className="flex-1 font-semibold">@mieayamsurabaya_</span>
                  <span className="text-[10px] font-bold uppercase text-[#BA382A] bg-red-50 px-2 py-0.5 rounded-full">
                    Instagram
                  </span>
                </a>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#BA382A]" aria-hidden="true" />
                <h3 className="font-sans font-bold text-lg text-stone-900">
                  Jam Operasional
                </h3>
              </div>
              <div className="space-y-1.5 font-sans text-xs">
                {schedule.map((item) => {
                  const isToday = item.dayOfWeek === todayDay;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                        isToday
                          ? "bg-[#FDF2F0] font-bold text-[#BA382A]"
                          : "text-stone-600"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {item.dayName}
                        {isToday && (
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-[#BA382A] text-white">
                            Hari Ini
                          </span>
                        )}
                      </span>
                      <span>
                        {item.isClosed
                          ? "Tutup"
                          : `${item.openTime} sampai ${item.closeTime} WIB`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order CTA */}
            <a
              href={`https://wa.me/${profile?.whatsappNumber || "6282319195854"}?text=Halo%20Mie%20Ayam%20Surabaya,%20saya%20ingin%20memesan.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-saigetsu w-full justify-center text-xs uppercase tracking-wider py-3 font-bold"
              aria-label="Pesan Sekarang via WhatsApp (buka di tab baru)"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Pesan Sekarang via WhatsApp</span>
            </a>

          </div>

          {/* Right Column: Google Maps Embed (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF8F5]">
              <span className="font-sans text-sm font-bold text-stone-900">
                Peta Lokasi Interaktif
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                Google Maps
              </span>
            </div>

            <div className="w-full flex-grow min-h-[420px] sm:min-h-[500px] relative bg-stone-100">
              <iframe
                src={
                  profile?.mapsEmbedUrl ||
                  "https://maps.google.com/maps?q=MIE%20AYAM%20SURABAYA%20Taman%20Pinang%20Indah%20Sidoarjo&t=&z=15&ie=UTF8&iwloc=&output=embed"
                }
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "420px" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi Mie Ayam Surabaya di Taman Pinang Indah Sidoarjo"
                className="w-full h-full"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
