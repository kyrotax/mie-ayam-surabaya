import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import MenuBoard from "@/components/public/MenuBoard";
import { ChineseKnotDivider } from "@/components/public/ChineseOrnaments";
import { MessageCircle, CheckCircle2 } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Daftar Menu & Harga",
  description:
    "Daftar menu lengkap Mie Ayam Surabaya oriental: Mie Ayam Komplit, Pangsit, Bakso, dan aneka minuman segar seperti Es Teler dan Es Teh.",
};

export default async function MenuPage() {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      items: {
        orderBy: { order: "asc" },
      },
    },
  });

  return (
    <div className="bg-[#FAF7F2] min-h-screen pt-28 pb-24 text-[#2C1810]">
      {/* Editorial Page Header */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-10 text-center">
        <p className="section-eyebrow-unified text-[#9A6B00] mb-2">
          Pilihan Sajian Lezat
        </p>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#2C1810] uppercase mb-4">
          DAFTAR MENU <span className="text-[#8B0000]">& HARGA</span>
        </h1>
        <ChineseKnotDivider variant="dark" className="my-3" />
        <p className="section-subheading-unified text-[#6B4423] max-w-2xl mx-auto leading-relaxed mb-6">
          Semua menu dibuat fresh dari mie kenyal buatan sendiri tiap pagi, disajikan hangat dengan kuah kaldu sapi gurih sedap dan bumbu ayam oriental yang meresap sempurna.
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-white border border-stone-200/90 shadow-sm text-xs text-[#2C1810]">
          <CheckCircle2 className="w-4 h-4 text-[#8B0000] shrink-0" aria-hidden="true" />
          <span>Bisa makan di tempat, bungkus bawa pulang, atau pesan via WhatsApp</span>
          <span className="text-stone-300">·</span>
          <a
            href="https://wa.me/6282319195854?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20memesan%20makanan."
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#8B0000] hover:text-[#C41E3A] inline-flex items-center gap-1 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat Langsung</span>
          </a>
        </div>
      </div>

      {/* Categorized Menu Board */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <MenuBoard categories={categories} />
      </div>
    </div>
  );
}

