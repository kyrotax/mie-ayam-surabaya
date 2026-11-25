import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ChineseKnotDivider } from "@/components/public/ChineseOrnaments";
import { Instagram, MessageCircle, Sparkles, Award, Heart } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Cerita di balik Mie Ayam Surabaya di Sidoarjo: mie kenyal buatan sendiri setiap pagi, kuah kaldu sapi hangat, dan bumbu ayam oriental yang meresap sedap.",
};

export default async function TentangPage() {
  const profile = await prisma.storeProfile.findFirst();

  return (
    <div className="bg-[#FAF7F2] min-h-screen pt-28 pb-24 text-[#2C1810]">
      {/* Editorial Page Header */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-10 text-center">
        <p className="section-eyebrow-unified text-[#9A6B00] mb-2">
          Cerita Hangat Kami
        </p>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#2C1810] uppercase mb-4">
          TENTANG <span className="text-[#8B0000]">KAMI</span>
        </h1>
        <ChineseKnotDivider variant="dark" className="my-3" />
        <p className="section-subheading-unified text-[#6B4423] max-w-2xl mx-auto leading-relaxed">
          Kisah sederhana di balik semangkuk mie ayam oriental kenyal, gurih, dan hangat untuk warga Sidoarjo dan sekitarnya.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
        {/* Main Story Card */}
        <section className="bg-white rounded-2xl border border-stone-200/90 p-8 sm:p-12 space-y-6 shadow-sm hover:border-[#D4AF37] transition-colors">
          <div className="pb-4 border-b border-stone-200">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#8B0000]">
              Cerita Di Balik Semangkuk Mie
            </h2>
          </div>

          <div className="space-y-4 section-body-unified text-[#2C1810] text-sm sm:text-base leading-relaxed">
            <p>
              Berawal dari kecintaan kami pada masakan mie berkuah hangat, Mie Ayam Surabaya hadir untuk membawa pengalaman kuliner oriental yang lezat, gurih, dan akrab di lidah semua orang.
            </p>
            <p className="text-[#6B4423]">
              Bagi kami, rasa enak itu kuncinya ada di proses yang jujur. Mienya kami giling sendiri setiap pagi dari bahan segar tanpa bahan pengawet, potongan ayamnya dimasak pelan dengan rempah pilihan hingga bumbunya meresap sempurna, dan kuah kaldunya direbus perlahan agar menghasilkan aroma gurih yang menenangkan.
            </p>
            <p className="text-[#6B4423]">
              Warung kami di kawasan Taman Pinang Indah bukan sekadar tempat makan, tapi juga tempat kumpul yang nyaman bareng keluarga, sahabat, atau rekan kerja. Mau santap langsung di warung, bungkus bawa pulang, atau pesan antar via WhatsApp, kami selalu senang bisa menyajikan porsi terbaik buat kamu.
            </p>
          </div>
        </section>

        {/* 3 Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-stone-200/90 p-6 space-y-3 shadow-sm hover:-translate-y-[6px] hover:shadow-xl hover:border-[#D4AF37] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#8B0000] text-[#FFD700] flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#2C1810]">
              Rasa Oriental yang Pas
            </h3>
            <p className="section-body-unified text-xs sm:text-sm text-[#6B4423] leading-relaxed">
              Perpaduan bumbu oriental gurih manis dengan mie kenyal alami dan kuah kaldu sapi harum yang pas di lidah.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200/90 p-6 space-y-3 shadow-sm hover:-translate-y-[6px] hover:shadow-xl hover:border-[#D4AF37] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#8B0000] text-[#FFD700] flex items-center justify-center shadow-md">
              <Award className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#2C1810]">
              Fresh Setiap Pagi
            </h3>
            <p className="section-body-unified text-xs sm:text-sm text-[#6B4423] leading-relaxed">
              Mie dibuat baru setiap hari tanpa pengawet, daging ayam pilihan segar, dan pangsit renyah gurih buatan dapur kami.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200/90 p-6 space-y-3 shadow-sm hover:-translate-y-[6px] hover:shadow-xl hover:border-[#D4AF37] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#8B0000] text-[#FFD700] flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#2C1810]">
              Porsi Puas, Harga Pas
            </h3>
            <p className="section-body-unified text-xs sm:text-sm text-[#6B4423] leading-relaxed">
              Porsi mantap yang bikin kenyang bahagia dengan harga terjangkau yang ramah buat siapa saja.
            </p>
          </div>
        </section>

        {/* Contact Banner */}
        <section className="bg-[#8B0000] text-[#FFF8E7] rounded-2xl p-8 sm:p-12 text-center space-y-4 border border-[#D4AF37]/40 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#FFD700]">
              Punya Pertanyaan atau Mau Pesan?
            </h3>
            <p className="section-subheading-unified text-[#FFF8E7]/90 max-w-md mx-auto leading-relaxed">
              Yuk intip kabar menu terbaru di Instagram kami atau langsung kirim pesan ke WhatsApp kalau mau pesan antar ke rumah!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={profile?.instagramUrl || "https://www.instagram.com/mieayamsurabaya_/"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-xs uppercase tracking-wider py-2.5 px-6"
                aria-label="Kunjungi Instagram @mieayamsurabaya_ (buka di tab baru)"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
                <span>@mieayamsurabaya_</span>
              </a>
              <a
                href={`https://wa.me/${profile?.whatsappNumber || "6282319195854"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#6B0000] hover:bg-[#A01414] text-[#FFD700] border border-[#D4AF37] font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-full transition-colors min-h-[44px]"
                aria-label="Chat via WhatsApp resmi (buka di tab baru)"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Chat WhatsApp Kami</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

