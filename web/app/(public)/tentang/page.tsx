import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Instagram, MessageCircle, Sparkles, Award, Heart } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal kisah perjalanan Mie Ayam Surabaya, UMKM kuliner penyaji mie ayam oriental dengan cita rasa otentik khas di Sidoarjo.",
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
              <span className="saigetsu-stamp">關於</span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#BA382A] font-bold">
                Kisah & Perjalanan
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-stone-900 uppercase leading-[0.95]">
              TENTANG KAMI
            </h1>
            <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
              Mengenal lebih dekat dedikasi Mie Ayam Surabaya dalam menyajikan semangkuk mie ayam oriental autentik bagi masyarakat Sidoarjo.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">

        {/* Main Story (Editorial Clean) */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <span className="saigetsu-stamp">理念</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 uppercase">
              Perjalanan & Nilai Usaha
            </h2>
          </div>

          <div className="space-y-4 text-stone-600 font-sans text-sm sm:text-base leading-relaxed">
            <p>
              {profile?.story ||
                "Mie Ayam Surabaya merupakan UMKM kuliner yang menyajikan mie ayam bergaya oriental, sehingga memiliki cita rasa khas yang berbeda dari mie ayam pada umumnya."}
            </p>
            <p>
              Dengan mengedepankan kualitas bahan baku dan racikan bumbu khas, kami senantiasa berusaha memberikan pengalaman kuliner terbaik bagi setiap pelanggan yang singgah maupun yang memesan secara online.
            </p>
            <p>
              Promosi produk aktif kami jalankan melalui media sosial TikTok dan Instagram dengan menyematkan nomor WhatsApp operasional resmi kami. Selain melayani pemesanan, layanan pesan instan ini juga aktif melayani pertanyaan seputar jam operasional dan ketersediaan menu.
            </p>
          </div>
        </section>

        {/* 3 Pillars (Saigetsu Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F0] text-[#BA382A] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-sans font-bold text-lg text-stone-900">
              Cita Rasa Oriental Khas
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
              Perpaduan bumbu oriental gurih dengan mie kenyal pas dan kuah kaldu harum yang kaya rempah.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F0] text-[#BA382A] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-sans font-bold text-lg text-stone-900">
              Bahan Segar Berkualitas
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
              Daging ayam pilihan, sayuran segar, bakso sapi, dan pangsit renyah diproses baru setiap hari.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F0] text-[#BA382A] flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-sans font-bold text-lg text-stone-900">
              Harga Ramah di Kantong
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
              Kualitas rasa premium standar restoran dengan harga yang terjangkau untuk dinikmati seluruh kalangan.
            </p>
          </div>
        </section>

        {/* Social Media & Contact Banner (Saigetsu Double Frame) */}
        <section className="bg-[#BA382A] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-md relative overflow-hidden">
          <div className="absolute inset-3 border border-white/20 rounded-2xl pointer-events-none" aria-hidden="true" />
          <div className="relative z-10 space-y-3">
            <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase">
              Terhubung Bersama Kami
            </h3>
            <p className="text-sm text-red-100 max-w-md mx-auto font-sans">
              Ikuti kabar terupdate menu, promo, dan keseharian kami di Instagram serta hubungi WhatsApp resmi kami.
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
                <span>Chat WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
