import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import MenuBoard from "@/components/public/MenuBoard";
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
    <div className="bg-[#FAF8F5] min-h-screen pt-28 pb-24">
      {/* Page Header (Saigetsu Style) */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full border-4 border-[#BA382A]/15 pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#BA382A] font-bold">
                Pilihan Sajian Lezat
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-stone-900 uppercase leading-[0.95]">
              MENU & HARGA
            </h1>

            <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
              Semua menu makanan dibuat fresh dari mie kenyal buatan sendiri, disajikan hangat dengan kuah kaldu sapi sedap, bumbu ayam yang gurih meresap, dan aneka minuman dingin pelepas dahaga.
            </p>

            {/* Quick Notice Pill */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-100 mt-4">
              <div className="flex items-center gap-2.5 text-xs text-stone-600 font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>
                  Bisa makan di tempat, bungkus bawa pulang, atau pesan antar ke rumah lewat <strong>WhatsApp</strong>.
                </span>
              </div>
              <a
                href="https://wa.me/6282319195854?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20memesan%20makanan."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-saigetsu text-xs uppercase tracking-wider py-2 px-4 shrink-0"
                aria-label="Pesan sekarang via WhatsApp (buka di tab baru)"
              >
                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Pesan Sekarang</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Categorized Menu Board with Dish Photography */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <MenuBoard categories={categories} />
      </div>
    </div>
  );
}
