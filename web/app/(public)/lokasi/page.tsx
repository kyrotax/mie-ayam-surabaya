import type { Metadata } from "next";
import HoursTable from "@/components/public/HoursTable";
import { MapPin, Phone, Instagram, ExternalLink, MessageCircle } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Lokasi & Jam Buka",
  description:
    "Lokasi warung Mie Ayam Surabaya di kawasan Taman Pinang Indah, Sidoarjo. Petunjuk arah Google Maps dan pemesanan via WhatsApp.",
};

const DEFAULT_PROFILE = {
  address: "Jl. Raya Taman Pinang Indah, Jetis, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61213",
  whatsappNumber: "6282319195854",
  instagramUrl: "https://www.instagram.com/mieayamsurabaya_/",
  mapsUrl:
    "https://www.google.com/maps/place/MIE+AYAM+SURABAYA/@-7.4492413,112.7050814,15z/data=!4m15!1m8!3m7!1s0x2dd7e1704b5593cd:0x81c8774cf4076883!2sMIE+AYAM+SURABAYA!8m2!3d-7.4493338!4d112.7049644!10e9!16s%2Fg%2F11z9hk1f4y!3m5!1s0x2dd7e1704b5593cd:0x81c8774cf4076883!8m2!3d-7.4493338!4d112.7049644!16s%2Fg%2F11z9hk1f4y",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=MIE%20AYAM%20SURABAYA%20Taman%20Pinang%20Indah%20Sidoarjo&t=&z=15&ie=UTF8&iwloc=&output=embed",
};

export default function LokasiPage() {
  const profile = DEFAULT_PROFILE;

  return (
    <div className="bg-[#FAF9F7] min-h-screen pt-28 pb-20 text-[#251C17]">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 mb-12 text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F3E4DE] text-[#8D0D00] border border-[#E3C1BA] mb-3">
          LOKASI & JAM OPERASIONAL
        </span>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.04em] text-[#251C17] mb-3">
          Kunjungi Warung Kami
        </h1>
        <p className="text-sm sm:text-base text-[#6E6259] max-w-xl mx-auto leading-relaxed">
          Berlokasi strategis di kawasan Taman Pinang Indah, Sidoarjo. Area parkir luas dan aman untuk motor maupun mobil.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Jam Buka Card */}
            <HoursTable />

            {/* Address Card */}
            <div className="bg-white rounded-[22px] p-6 border border-[#DCD5CD] shadow-[0_4px_14px_rgba(46,31,21,0.03)] space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#F4F0EB] text-[#8D0D00] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#251C17]">
                    Alamat Lengkap
                  </h3>
                  <p className="text-xs sm:text-sm text-[#443831] mt-1 leading-relaxed">
                    {profile.address}
                  </p>
                </div>
              </div>

              <a
                href={profile.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-[12px] border border-[#D5CEC5] bg-white py-2.5 text-xs font-semibold text-[#251C17] hover:border-[#8D0D00] hover:text-[#8D0D00] transition-colors"
                aria-label="Buka di Google Maps (buka di tab baru)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Petunjuk Arah di Maps</span>
              </a>
            </div>

            {/* Contacts & Order */}
            <div className="bg-white rounded-[22px] p-6 border border-[#DCD5CD] shadow-[0_4px_14px_rgba(46,31,21,0.03)] space-y-3">
              <h3 className="font-semibold text-base text-[#251C17]">
                Kontak & Pemesanan
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <a
                  href={`https://wa.me/${profile.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-[12px] bg-[#FAF9F7] border border-[#E3DDD6] text-[#251C17] hover:border-[#8D0D00] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#8D0D00]" />
                    <span className="font-semibold">0823-1919-5854</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#8D0D00] bg-[#F3E4DE] px-2 py-0.5 rounded-full">
                    WhatsApp
                  </span>
                </a>

                <a
                  href={profile.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-[12px] bg-[#FAF9F7] border border-[#E3DDD6] text-[#251C17] hover:border-[#8D0D00] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Instagram className="w-4 h-4 text-[#8D0D00]" />
                    <span className="font-semibold">@mieayamsurabaya_</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#74675E] bg-[#F4F0EB] px-2 py-0.5 rounded-full">
                    Instagram
                  </span>
                </a>
              </div>

              <a
                href={`https://wa.me/${profile.whatsappNumber}?text=Halo%20Mie%20Ayam%20Surabaya,%20saya%20ingin%20memesan.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-[12px] bg-[#8D0D00] py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#6F0A00] transition-colors mt-2"
                aria-label="Pesan via WhatsApp (buka di tab baru)"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Pesan Sekarang via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps Embed (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#DCD5CD] overflow-hidden shadow-[0_6px_20px_rgba(46,31,21,0.035)] flex flex-col">
            <div className="p-4 border-b border-[#E3DDD6] flex items-center justify-between bg-[#FAF9F7] text-[#251C17]">
              <span className="text-xs font-semibold text-[#8D0D00]">
                Peta Petunjuk Arah
              </span>
              <span className="text-[11px] text-[#74675E] font-medium">
                Google Maps Interaktif
              </span>
            </div>

            <div className="w-full flex-grow min-h-[460px] sm:min-h-[560px] relative bg-[#FAF7F2]">
              <iframe
                title="Peta Lokasi Mie Ayam Surabaya di Taman Pinang Indah Sidoarjo"
                src={profile.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "460px" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
