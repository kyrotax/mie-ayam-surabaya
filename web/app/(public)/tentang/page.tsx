import type { Metadata } from "next";
import { prisma } from "@/lib/db";
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
    <div className="bg-[#FAF8F5] min-h-screen pt-28 pb-24">
      {/* Header Banner */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border-4 border-[#BA382A]/15 pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#BA382A] font-bold">
                Cerita Hangat Kami
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-stone-900 uppercase leading-[0.95]">
              TENTANG KAMI
            </h1>
            <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
              Kisah sederhana di balik semangkuk mie ayam oriental kenyal, gurih, dan hangat untuk warga Sidoarjo dan sekitarnya.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">

        {/* Main Story */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 uppercase">
              Cerita Di Balik Semangkuk Mie
            </h2>
          </div>

          <div className="space-y-4 text-stone-600 font-sans text-sm sm:text-base leading-relaxed">
            <p>
              Berawal dari kecintaan kami pada masakan mie berkuah hangat, Mie Ayam Surabaya hadir untuk membawa pengalaman kuliner oriental yang lezat, gurih, dan akrab di lidah semua orang.
            </p>
            <p>
              Bagi kami, rasa enak itu kuncinya ada di proses yang jujur. Mienya kami giling sendiri setiap pagi dari bahan segar tanpa bahan pengawet, potongan ayamnya dimasak pelan dengan rempah pilihan hingga bumbunya meresap sempurna, dan kuah kaldunya direbus perlahan agar menghasilkan aroma gurih yang menenangkan.
            </p>
            <p>
              Warung kami di kawasan Taman Pinang Indah bukan sekadar tempat makan, tapi juga tempat kumpul yang nyaman bareng keluarga, sahabat, atau rekan kerja. Mau santap langsung di warung, bungkus bawa pulang, atau pesan antar via WhatsApp, kami selalu senang bisa menyajikan porsi terbaik buat kamu!
            </p>
          </div>
        </section>

        {/* 3 Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F0] text-[#BA382A] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-sans font-bold text-lg text-stone-900">
              Rasa Oriental yang Pas
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
              Perpaduan bumbu oriental gurih manis dengan mie kenyal alami dan kuah kaldu sapi harum yang tidak berlebihan.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F0] text-[#BA382A] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-sans font-bold text-lg text-stone-900">
              Fresh Setiap Pagi
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
              Mie dibuat baru setiap hari tanpa pengawet, daging ayam pilihan segar, dan pangsit renyah gurih buatan dapur kami.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F0] text-[#BA382A] flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-sans font-bold text-lg text-stone-900">
              Porsi Puas, Harga Pas
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
              Porsi mantap yang bikin kenyang bahagia dengan harga terjangkau yang ramah buat siapa saja.
            </p>
          </div>
        </section>

        {/* Social Media & Contact Banner */}
        <section className="bg-[#BA382A] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-md relative overflow-hidden">
          <div className="absolute inset-3 border border-white/20 rounded-2xl pointer-events-none" aria-hidden="true" />
          <div className="relative z-10 space-y-3">
            <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase">
              Punya Pertanyaan atau Mau Pesan?
            </h3>
            <p className="text-sm text-red-100 max-w-md mx-auto font-sans leading-relaxed">
              Yuk intip kabar menu terbaru di Instagram kami atau langsung kirim pesan ke WhatsApp kalau mau pesan antar ke rumah!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={profile?.instagramUrl || "https://www.instagram.com/mieayamsurabaya_/"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-saigetsu-white text-xs uppercase tracking-wider py-2.5 px-4"
                aria-label="Kunjungi Instagram @mieayamsurabaya_ (buka di tab baru)"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
                <span>@mieayamsurabaya_</span>
              </a>
              <a
                href={`https://wa.me/${profile?.whatsappNumber || "6282319195854"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors inline-flex items-center gap-2"
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
