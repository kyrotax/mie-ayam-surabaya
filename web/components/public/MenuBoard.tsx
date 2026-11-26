"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { ChineseKnotDivider } from "./ChineseOrnaments";
import PriceCounter from "./PriceCounter";
import { useLiveData } from "@/lib/public/LiveDataContext";

export interface MenuItemProps {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  badge?: string | null;
}

export interface CategoryProps {
  id: number;
  name: string;
  slug: string;
  items: MenuItemProps[];
}

const LEGACY_IMAGE_MAP: Record<string, string> = {
  "/images/menu/mie-komplit.png": "/images/mie-ayam-komplit.png",
  "/images/menu/mie-ayam.png": "/images/mie-ayam.png",
  "/images/menu/mie-bakso.png": "/images/mie-ayam-bakso.png",
  "/images/menu/mie-pangsit.png": "/images/mie-ayam-pangsit.png",
  "/images/menu/kuah-kaldu.png": "/images/mie-ayam-bakso.png",
  "/images/menu/es-teh.jpg": "/images/es-teh.png",
  "/images/menu/teh-hangat.jpg": "/images/teh-hangat.jpg",
  "/images/menu/es-teler.jpg": "/images/es-teler.png",
};

function resolveMenuImage(imageUrl?: string | null): string {
  if (!imageUrl) return "/images/mie-ayam-komplit.png";
  return LEGACY_IMAGE_MAP[imageUrl] || imageUrl;
}

export default function MenuBoard({ categories }: { categories: CategoryProps[] }) {
  const { siteData } = useLiveData();

  const displayCategories: CategoryProps[] =
    categories && categories.length > 0
      ? categories
      : [
          {
            id: 1,
            name: "Mie Ayam & Makanan",
            slug: "makanan",
            items: siteData.menuMakanan.map((m, i) => ({
              id: Number(m.id) || i + 1,
              name: m.nama,
              description: m.deskripsi,
              price: m.harga,
              imageUrl: m.foto,
              isAvailable: m.isAvailable ?? true,
              isFeatured: false,
              badge: m.badge,
            })),
          },
          {
            id: 2,
            name: "Minuman Segar",
            slug: "minuman",
            items: siteData.menuMinuman.map((m, i) => ({
              id: Number(m.id) || 100 + i + 1,
              name: m.nama,
              description: m.deskripsi,
              price: m.harga,
              imageUrl: m.foto,
              isAvailable: m.isAvailable ?? true,
              isFeatured: false,
              badge: m.badge,
            })),
          },
        ];

  if (!displayCategories || displayCategories.length === 0) {
    return (
      <div className="text-center py-16 px-6 rounded-2xl bg-white border-2 border-[#D4AF37]/50 text-[#2C1810] shadow-gold">
        <p className="font-display text-2xl font-bold uppercase text-[#8B0000] mb-2">
          Menu Sedang Diperbarui
        </p>
        <p className="text-sm text-[#6B4423] max-w-md mx-auto mb-6">
          Silakan hubungi kami langsung melalui WhatsApp untuk menanyakan daftar menu dan ketersediaan hari ini.
        </p>
        <a
          href="https://wa.me/6282319195854?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20tanya%20menu%20hari%20ini."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-red-gold text-xs uppercase tracking-wider py-2.5 px-5"
        >
          <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Tanya via WhatsApp</span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-14">
      {displayCategories.map((cat) => (
        <section key={cat.id} aria-labelledby={`category-title-${cat.id}`}>
          {/* Category Header */}
          <div className="text-center mb-6">
            <h2
              id={`category-title-${cat.id}`}
              className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#2C1810] uppercase"
            >
              {cat.name}
            </h2>
            <ChineseKnotDivider variant="dark" className="my-3" />
          </div>

          {/* Menu Rows: Digital Menu Style with Dot Leaders */}
          <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden divide-y divide-stone-100 shadow-sm">
            {cat.items.map((item) => {
              const waLink = `https://wa.me/6282319195854?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20pesan%20${encodeURIComponent(
                item.name
              )}.`;
              const imageSrc = resolveMenuImage(item.imageUrl);

              return (
                <div
                  key={item.id}
                  className="group p-5 sm:p-6 hover:bg-[#FAF7F2] transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                >
                  {/* Dish Thumbnail */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-stone-50">
                    <Image
                      src={imageSrc}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 96px, 112px"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-heading font-bold text-lg sm:text-xl text-[#2C1810] group-hover:text-[#8B0000] transition-colors">
                        {item.name}
                      </span>
                      {item.badge && <span className="badge-chinese">{item.badge}</span>}
                      {!item.isAvailable && (
                        <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 text-[#8B0000]">
                          Habis
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-[#6B4423] font-sans leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Dotted Leader Line (Desktop) */}
                  <div className="hidden lg:block chinese-dot-leader" aria-hidden="true" />

                  {/* Price and Action Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                    {item.isAvailable ? (
                      <PriceCounter
                        value={item.price}
                        className="font-heading text-2xl font-bold text-[#8B0000]"
                      />
                    ) : (
                      <span className="font-heading text-2xl font-bold text-stone-400 line-through">
                        {formatRupiah(item.price)}
                      </span>
                    )}

                    {item.isAvailable ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-red-gold text-xs uppercase tracking-wider py-2 px-4 min-h-[44px]"
                        aria-label={`Pesan ${item.name} via WhatsApp (buka di tab baru)`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>Pesan</span>
                      </a>
                    ) : (
                      <span className="text-xs font-semibold text-[#6B4423] px-3 py-2 bg-stone-100 rounded-lg border border-stone-200">
                        Stok Habis
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
