import type { Metadata } from "next";
import { Instagram, MessageCircle, Sparkles, Award, Heart } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Cerita di balik Mie Ayam Surabaya di Sidoarjo: mie kenyal buatan sendiri setiap pagi, kuah kaldu sapi hangat, dan bumbu ayam oriental.",
};

const DEFAULT_PROFILE = {
  instagramUrl: "https://www.instagram.com/mieayamsurabaya_/",
  whatsappNumber: "6282319195854",
};

export default function TentangPage() {
  const profile = DEFAULT_PROFILE;

  return (
    <div className="bg-[#FAF9F7] min-h-screen pt-28 pb-20 text-[#251C17]">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 mb-12 text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F3E4DE] text-[#8D0D00] border border-[#E3C1BA] mb-3">
          TENTANG KAMI
        </span>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.04em] text-[#251C17] mb-3">
          Cerita di Balik Semangkuk Mie
        </h1>
        <p className="text-sm sm:text-base text-[#6E6259] max-w-xl mx-auto leading-relaxed">
          Kisah sederhana menyajikan mie ayam oriental kenyal, gurih, dan hangat untuk warga Sidoarjo dan sekitarnya.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-10">
        {/* Main Story Card */}
        <section className="bg-white rounded-[26px] border border-[#DCD5CD] p-8 sm:p-12 space-y-6 shadow-[0_6px_20px_rgba(46,31,21,0.035)]">
          <div className="space-y-4 text-xs sm:text-sm text-[#443831] leading-relaxed">
            <p className="text-sm sm:text-base font-semibold text-[#251C17]">
              Bagi kami, rasa enak bermula dari proses yang jujur.
            </p>
            <p>
              Mienya kami giling sendiri setiap pagi dari bahan segar tanpa bahan pengawet. Teksturnya kenyal alami, lembut saat dikunyah, dan tidak mudah lembek.
            </p>
            <p className="text-[#6E6259]">
              Potongan ayam dimasak perlahan dengan rempah pilihan hingga bumbunya meresap sempurna, berpadu dengan kuah kaldu sapi bening yang harum dan menenangkan.
            </p>
            <p className="text-[#6E6259]">
              Warung kami di kawasan Taman Pinang Indah siap menyambut Anda untuk makan di tempat, bungkus bawa pulang, maupun pesan antar via WhatsApp.
            </p>
          </div>
        </section>

        {/* 3 Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[22px] border border-[#DCD5CD] p-6 space-y-3 shadow-[0_4px_14px_rgba(46,31,21,0.03)]">
            <div className="w-10 h-10 rounded-[12px] bg-[#F4F0EB] text-[#8D0D00] flex items-center justify-center">
              <Sparkles className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <h3 className="font-semibold text-base text-[#251C17]">
              Rasa Oriental Pas
            </h3>
            <p className="text-xs text-[#6E6259] leading-relaxed">
              Perpaduan bumbu gurih manis dengan mie kenyal alami dan kuah kaldu sapi harum.
            </p>
          </div>

          <div className="bg-white rounded-[22px] border border-[#DCD5CD] p-6 space-y-3 shadow-[0_4px_14px_rgba(46,31,21,0.03)]">
            <div className="w-10 h-10 rounded-[12px] bg-[#F4F0EB] text-[#8D0D00] flex items-center justify-center">
              <Award className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <h3 className="font-semibold text-base text-[#251C17]">
              Fresh Setiap Pagi
            </h3>
            <p className="text-xs text-[#6E6259] leading-relaxed">
              Adonan mie dibuat baru setiap hari tanpa pengawet dengan bahan pilihan segar.
            </p>
          </div>

          <div className="bg-white rounded-[22px] border border-[#DCD5CD] p-6 space-y-3 shadow-[0_4px_14px_rgba(46,31,21,0.03)]">
            <div className="w-10 h-10 rounded-[12px] bg-[#F4F0EB] text-[#8D0D00] flex items-center justify-center">
              <Heart className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <h3 className="font-semibold text-base text-[#251C17]">
              Porsi Memuaskan
            </h3>
            <p className="text-xs text-[#6E6259] leading-relaxed">
              Porsi pas yang mengenyangkan dengan harga bersahabat untuk siapa saja.
            </p>
          </div>
        </section>

        {/* Contact Banner */}
        <section className="bg-[#251C17] text-white rounded-[26px] p-8 sm:p-10 border border-[#3A2922] shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.03em] text-white">
              Punya Pertanyaan atau Mau Pesan?
            </h3>
            <p className="text-xs sm:text-sm text-[#D8D0C7]">
              Hubungi WhatsApp kami atau ikuti kabar terbaru di Instagram.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${profile.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[12px] bg-[#8D0D00] px-5 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#A01414] transition-colors"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>WhatsApp Kami</span>
            </a>

            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[12px] border border-white/20 bg-white/10 px-4 py-3 text-xs font-semibold text-[#E8E2D9] hover:bg-white/20 transition-colors"
            >
              <Instagram className="w-4 h-4 text-[#F0C87D]" />
              <span>Instagram</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
