"use client";

import Image from "next/image";
import { MessageCircle, Utensils } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

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

export default function MenuBoard({ categories }: { categories: CategoryProps[] }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-16 px-6 rounded-3xl bg-white border border-stone-200 text-stone-700 shadow-sm">
        <p className="font-display text-2xl font-bold uppercase text-[#BA382A] mb-2">
          Menu Sedang Diperbarui
        </p>
        <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
          Silakan hubungi kami langsung melalui WhatsApp untuk menanyakan daftar menu dan ketersediaan hari ini.
        </p>
        <a
          href="https://wa.me/6282319195854?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20tanya%20menu%20hari%20ini."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-saigetsu text-xs uppercase tracking-wider py-2.5 px-5"
        >
          <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Tanya via WhatsApp</span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {categories.map((cat) => (
        <section key={cat.id} aria-labelledby={`category-title-${cat.id}`}>
          {/* Category Header (Saigetsu Editorial Style) */}
          <div className="flex items-center gap-4 mb-6">
            <span className="saigetsu-stamp text-xs py-1 px-2.5">
              {cat.slug === "makanan" ? "料理" : "飲品"}
            </span>
            <h2
              id={`category-title-${cat.id}`}
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 uppercase"
            >
              {cat.name}
            </h2>
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold hidden sm:inline">
              Autentik Pilihan
            </span>
          </div>

          {/* Menu Rows with Food Images */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden divide-y divide-stone-100 shadow-sm">
            {cat.items.map((item) => {
              const waLink = `https://wa.me/6282319195854?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20pesan%20${encodeURIComponent(
                item.name
              )}.`;
              const imageSrc = item.imageUrl || "/images/menu/mie-komplit.png";

              return (
                <div
                  key={item.id}
                  className="group p-5 sm:p-6 hover:bg-[#FAF8F5] transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6"
                >
                  {/* Dish Thumbnail Asset */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-stone-200 shrink-0 bg-stone-100 shadow-sm">
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
                      <span className="font-sans font-bold text-lg sm:text-xl text-stone-900 group-hover:text-[#BA382A] transition-colors">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="badge-saigetsu">{item.badge}</span>
                      )}
                      {!item.isAvailable && (
                        <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          Habis
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Dotted Leader Line (Desktop) */}
                  <div className="hidden lg:block saigetsu-dot-leader" aria-hidden="true" />

                  {/* Price and Action Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <span
                      className={`font-display text-2xl font-bold ${
                        item.isAvailable
                          ? "text-[#BA382A]"
                          : "text-stone-300 line-through"
                      }`}
                    >
                      {formatRupiah(item.price)}
                    </span>
                    {item.isAvailable ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-saigetsu text-xs uppercase tracking-wider py-2 px-4"
                        aria-label={`Pesan ${item.name} via WhatsApp (buka di tab baru)`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>Pesan</span>
                      </a>
                    ) : (
                      <span className="text-xs font-semibold text-stone-400 px-3 py-1 bg-stone-100 rounded-lg">
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
