import type { Metadata } from "next";
import { supabase } from "@/src/supabaseClient";
import { getSignedFileUrl } from "@/lib/storage";
import MenuBoard from "@/components/public/MenuBoard";
import { MessageCircle, CheckCircle2 } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Daftar Menu & Harga",
  description:
    "Daftar menu lengkap Mie Ayam Surabaya oriental: Mie Ayam Komplit, Pangsit, Bakso, dan aneka minuman segar seperti Es Teler dan Es Teh.",
};

export default async function MenuPage() {
  const { data: items } = await supabase
    .from("menu_items")
    .select("*")
    .order("order_index", { ascending: true });

  const resolvedItems = await Promise.all(
    (items ?? []).map(async (row) => ({
      ...row,
      resolvedImageUrl: row.image_url ? await getSignedFileUrl(row.image_url) : null,
    }))
  );

  // Group into the CategoryProps shape expected by MenuBoard
  const categoryMap: Record<
    string,
    { id: number; name: string; slug: string; order: number; items: ReturnType<typeof mapItem>[] }
  > = {};

  let catIdCounter = 1;

  function mapItem(row: (typeof resolvedItems)[number]) {
    return {
      id: Number(row.id),
      name: row.name as string,
      description: (row.description as string | null) ?? null,
      price: Number(row.price ?? 0),
      imageUrl: row.resolvedImageUrl,
      isAvailable: Boolean(row.is_available),
      isFeatured: false,
      badge: null,
    };
  }

  for (const item of resolvedItems) {
    const cat = (item.category as string) ?? "Lainnya";
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        id: catIdCounter++,
        name: cat,
        slug: cat.toLowerCase().replace(/\s+/g, "-"),
        order: (item.order_index as number) ?? 99,
        items: [],
      };
    }
    categoryMap[cat].items.push(mapItem(item));
  }

  const categories = Object.values(categoryMap).sort((a, b) => a.order - b.order);

  return (
    <div className="bg-[#FAF9F7] min-h-screen pt-28 pb-20 text-[#251C17]">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 mb-10 text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F3E4DE] text-[#8D0D00] border border-[#E3C1BA] mb-3">
          DAFTAR HARGA
        </span>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.04em] text-[#251C17] mb-3">
          Menu & Pilihan Sajian
        </h1>
        <p className="text-sm sm:text-base text-[#6E6259] max-w-xl mx-auto leading-relaxed mb-6">
          Seluruh menu dibuat dari mie kenyal buatan sendiri tiap pagi, disajikan hangat dengan kuah kaldu sapi dan bumbu ayam meresap.
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-full bg-white border border-[#D5CEC5] shadow-xs text-xs text-[#251C17]">
          <CheckCircle2 className="w-4 h-4 text-[#8D0D00] shrink-0" aria-hidden="true" />
          <span>Makan di tempat, bungkus, atau pesan antar</span>
          <span className="text-[#DDD7D0]">•</span>
          <a
            href="https://wa.me/6282319195854?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20memesan."
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#8D0D00] hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Pesan via WhatsApp</span>
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
