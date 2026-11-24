// MenuCard: foto bleed + nama + harga (tanpa shadow tebal)
// Dua varian: large (featured besar) dan small (supporting 2 kecil)
import Image from "next/image";
import { formatRupiah } from "@/lib/utils";

interface MenuCardProps {
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  badge?: string | null;
  isAvailable: boolean;
  waNumber: string;
  variant?: "large" | "small";
}

export default function MenuCard({
  name,
  description,
  price,
  imageUrl,
  badge,
  isAvailable,
  waNumber,
  variant = "small",
}: MenuCardProps) {
  const waLink = `https://wa.me/${waNumber}?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20pesan%20${encodeURIComponent(name)}.`;
  const imgSrc = imageUrl || "/images/menu/mie-komplit.png";

  if (variant === "large") {
    return (
      <article className="group relative rounded-[12px] overflow-hidden bg-stone-900">
        {/* Foto bleed penuh ke tepi kartu */}
        <div className="relative h-72 sm:h-80 w-full">
          <Image
            src={imgSrc}
            alt={`${name} · Mie Ayam Surabaya`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent" />
        </div>

        {/* Info di atas foto */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          {badge && (
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#8B1E1E] text-white mb-2">
              {badge}
            </span>
          )}
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase leading-tight">
            {name}
          </h3>
          {description && (
            <p className="text-stone-300 text-sm mt-1 line-clamp-2 font-sans">{description}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="font-display text-2xl font-bold text-[#F5E6D3]">
              {formatRupiah(price)}
            </span>
            {isAvailable ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Pesan ${name} via WhatsApp`}
                className="inline-flex items-center gap-1.5 bg-white text-[#8B1E1E] hover:bg-[#8B1E1E] hover:text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-colors duration-200 min-h-[36px]"
              >
                Pesan
              </a>
            ) : (
              <span className="text-xs font-semibold text-stone-400 px-3 py-1 bg-stone-700/60 rounded-full">
                Stok Habis
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Small variant
  return (
    <article className="group relative rounded-[12px] overflow-hidden bg-stone-900">
      <div className="relative h-44 sm:h-48 w-full">
        <Image
          src={imgSrc}
          alt={`${name} · Mie Ayam Surabaya`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-display text-lg font-bold text-white uppercase leading-tight">
          {name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-display text-base font-bold text-[#F5E6D3]">
            {formatRupiah(price)}
          </span>
          {isAvailable ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Pesan ${name} via WhatsApp`}
              className="inline-flex items-center gap-1 bg-[#8B1E1E] hover:bg-[#6B1515] text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors duration-200 min-h-[32px]"
            >
              Pesan
            </a>
          ) : (
            <span className="text-[10px] text-stone-400 px-2 py-1 bg-stone-700/60 rounded-full font-semibold">
              Habis
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

