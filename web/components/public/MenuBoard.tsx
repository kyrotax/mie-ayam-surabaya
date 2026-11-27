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
  if (LEGACY_IMAGE_MAP[imageUrl]) return LEGACY_IMAGE_MAP[imageUrl];
  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:") ||
    imageUrl.startsWith("/images/")
  ) {
    return imageUrl;
  }
  return `/api/storage/${imageUrl.replace(/^\/+/, "")}`;
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
      <div className="text-center py-16 px-6 rounded-[22px] bg-white border border-[#DCD5CD] text-[#251C17] shadow-sm">
        <p className="text-xl font-semibold text-[#251C17] mb-2">
          Menu Sedang Diperbarui
        </p>
        <p className="text-sm text-[#6E6259] max-w-md mx-auto mb-6">
          Hubungi kami melalui WhatsApp untuk konfirmasi ketersediaan menu hari ini.
        </p>
        <a
          href="https://wa.me/6282319195854?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20tanya%20menu%20hari%20ini."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-[12px] bg-[#8D0D00] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#6F0A00] transition-colors"
        >
          <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Tanya via WhatsApp</span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {displayCategories.map((cat) => (
        <section key={cat.id} aria-labelledby={`category-title-${cat.id}`}>
          {/* Category Header */}
          <div className="flex items-center gap-3 mb-6">
            <h2
              id={`category-title-${cat.id}`}
              className="text-xl sm:text-2xl font-semibold tracking-[-0.03em] text-[#251C17]"
            >
              {cat.name}
            </h2>
            <span className="flex-1 h-px bg-[#E2DBD3]" aria-hidden="true" />
          </div>

          {/* Menu Rows */}
          <div className="bg-white rounded-[22px] border border-[#DCD5CD] overflow-hidden divide-y divide-[#EFEAE4] shadow-[0_6px_20px_rgba(46,31,21,0.035)]">
            {cat.items.map((item) => {
              const waLink = `https://wa.me/6282319195854?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20pesan%20${encodeURIComponent(
                item.name
              )}.`;
              const imageSrc = resolveMenuImage(item.imageUrl);

              return (
                <div
                  key={item.id}
                  className="group p-5 sm:p-6 hover:bg-[#FAF9F7] transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                >
                  {/* Dish Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[14px] overflow-hidden border border-[#E3DDD6] shrink-0 bg-[#FAF7F2]">
                    <Image
                      src={imageSrc}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 80px, 96px"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-base sm:text-lg text-[#251C17] group-hover:text-[#8D0D00] transition-colors">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-semibold bg-[#F3E4DE] text-[#8D0D00]">
                          {item.badge}
                        </span>
                      )}
                      {!item.isAvailable && (
                        <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F4F0EB] text-[#8A7C72]">
                          Habis
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-[#6E6259] leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Price and Action Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#EFEAE4]">
                    {item.isAvailable ? (
                      <PriceCounter
                        value={item.price}
                        className="text-lg sm:text-xl font-semibold tracking-[-0.03em] text-[#8D0D00]"
                      />
                    ) : (
                      <span className="text-lg sm:text-xl font-semibold text-[#A6978C] line-through">
                        {formatRupiah(item.price)}
                      </span>
                    )}

                    {item.isAvailable ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-[12px] bg-[#8D0D00] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#6F0A00] transition-colors"
                        aria-label={`Pesan ${item.name} via WhatsApp (buka di tab baru)`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>Pesan</span>
                      </a>
                    ) : (
                      <span className="text-xs font-semibold text-[#8A7C72] px-3 py-1.5 bg-[#F4F0EB] rounded-lg">
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
