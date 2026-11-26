import type { Metadata } from "next";
import { ChineseKnotDivider } from "@/components/public/ChineseOrnaments";
import { MapPin, Phone, Instagram, ExternalLink, MessageCircle, Clock } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Lokasi Warung",
  description:
    "Lokasi warung Mie Ayam Surabaya di kawasan Taman Pinang Indah, Sidoarjo. Petunjuk arah Google Maps dan pemesanan via WhatsApp.",
};

// Static profile data (not yet stored in Supabase — uses defaults)
const DEFAULT_PROFILE = {
  address: "Jl. Raya Taman Pinang Indah, Jetis, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61213",
  whatsappNumber: "6282319195854",
  instagramUrl: "https://www.instagram.com/mieayamsurabaya_/",
  mapsUrl: "https://www.google.com/maps/place/MIE+AYAM+SURABAYA,+Jl.+Raya+Taman+Pinang+Indah",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=MIE%20AYAM%20SURABAYA%20Taman%20Pinang%20Indah%20Sidoarjo&t=&z=15&ie=UTF8&iwloc=&output=embed",
};

export default async function LokasiPage() {
  const profile = DEFAULT_PROFILE;

  return (
    <div className="bg-[#FAF7F2] min-h-screen pt-28 pb-24 text-[#2C1810]">
      {/* Editorial Page Header */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-10 text-center">
        <p className="section-eyebrow-unified text-[#9A6B00] mb-2">
          Jam Buka & Arah Jalan
        </p>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#2C1810] uppercase mb-4">
          LOKASI <span className="text-[#8B0000]">WARUNG</span>
        </h1>
        <ChineseKnotDivider variant="dark" className="my-3" />
        <p className="section-subheading-unified text-[#6B4423] max-w-2xl mx-auto leading-relaxed">
          Warung kami berlokasi strategis di kawasan Taman Pinang Indah, Sidoarjo. Yuk mampir langsung atau pesan antar lewat WhatsApp!
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Jam Buka Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm hover:border-[#D4AF37] transition-colors space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8B0000] text-[#FFD700] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" aria-hidden="true" />
                </div>
                <h2 className="font-heading font-bold text-xl text-[#2C1810]">
                  Jam Buka
                </h2>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-200 text-sm">
                <span className="section-body-unified text-[#6B4423]">Selasa - Minggu</span>
                <span className="font-heading font-bold text-lg text-[#8B0000]">13.00 - Habis</span>
              </div>
              <p className="text-xs font-semibold text-[#8B0000] bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">
                Setiap hari Senin libur
              </p>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm hover:border-[#D4AF37] transition-colors space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8B0000] text-[#FFD700] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#2C1810]">
                    Alamat Warung
                  </h3>
                  <p className="section-body-unified text-xs sm:text-sm text-[#2C1810] mt-1 leading-relaxed">
                    {profile?.address ||
                      "Jl. Raya Taman Pinang Indah, Jetis, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61213"}
                  </p>
                  <p className="section-body-unified text-xs text-[#6B4423] mt-2">
                    Kawasan perumahan asri & nyaman. Area parkir luas dan aman untuk motor maupun mobil.
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
                className="btn-gold w-full justify-center text-xs uppercase tracking-wider py-2.5 font-bold shadow-sm"
                aria-label="Buka di Google Maps (buka di tab baru)"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Buka Petunjuk Arah di Maps</span>
              </a>
            </div>

            {/* Official Contacts */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm hover:border-[#D4AF37] transition-colors space-y-4">
              <h3 className="font-heading font-bold text-lg text-[#2C1810]">
                Kontak & WhatsApp Kami
              </h3>
              <p className="section-body-unified text-xs text-[#6B4423]">
                Mau tanya ketersediaan menu atau pesan antar ke rumah? Kami siap bantu!
              </p>
              <div className="space-y-2.5 font-sans text-xs sm:text-sm">
                <a
                  href={`https://wa.me/${profile?.whatsappNumber || "6282319195854"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-[#2C1810] hover:text-[#8B0000] transition-colors min-h-[44px]"
                  aria-label="WhatsApp 0823-1919-5854 (buka di tab baru)"
                >
                  <Phone className="w-4 h-4 text-[#8B0000] shrink-0" aria-hidden="true" />
                  <span className="flex-1 font-semibold">0823-1919-5854</span>
                  <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Chat WA
                  </span>
                </a>
                <a
                  href={profile?.instagramUrl || "https://www.instagram.com/mieayamsurabaya_/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-[#2C1810] hover:text-[#8B0000] transition-colors min-h-[44px]"
                  aria-label="Instagram @mieayamsurabaya_ (buka di tab baru)"
                >
                  <Instagram className="w-4 h-4 text-[#8B0000] shrink-0" aria-hidden="true" />
                  <span className="flex-1 font-semibold">@mieayamsurabaya_</span>
                  <span className="text-[10px] font-bold uppercase text-[#8B0000] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                    Instagram
                  </span>
                </a>
              </div>
            </div>

            {/* Order CTA */}
            <a
              href={`https://wa.me/${profile?.whatsappNumber || "6282319195854"}?text=Halo%20Mie%20Ayam%20Surabaya,%20saya%20ingin%20memesan.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-red-gold w-full justify-center text-xs uppercase tracking-wider py-3 font-bold shadow-md"
              aria-label="Pesan Sekarang via WhatsApp (buka di tab baru)"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Pesan Sekarang Lewat WhatsApp</span>
            </a>
          </div>

          {/* Right Column: Google Maps Embed (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-md flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 text-[#2C1810]">
              <span className="font-heading text-sm font-bold text-[#8B0000]">
                Peta Petunjuk Arah
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[#6B4423] font-semibold">
                Google Maps Interaktif
              </span>
            </div>

            <div className="w-full flex-grow min-h-[420px] sm:min-h-[520px] relative bg-stone-100">
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

