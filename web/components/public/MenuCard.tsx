import Image from "next/image";
import { MessageCircle } from "lucide-react";
import PriceCounter from "./PriceCounter";

interface MenuCardProps {
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  badge?: string | null;
  isAvailable: boolean;
  waNumber: string;
}

export default function MenuCard({
  name,
  description,
  price,
  imageUrl,
  badge,
  isAvailable,
  waNumber,
}: MenuCardProps) {
  const waLink = `https://wa.me/${waNumber}?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20pesan%20${encodeURIComponent(
    name
  )}.`;
  const imgSrc = imageUrl || "/images/mie-ayam-komplit.png";

  return (
    <article className="group h-full flex flex-col rounded-xl overflow-hidden bg-white border border-stone-200/90 hover:border-[#D4AF37] hover:-translate-y-[6px] hover:shadow-2xl transition-all duration-300 ease-out [backface-visibility:hidden]">
      {/* Photo container (clean 4:3, no clutter) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF6EE]">
        <Image
          src={imgSrc}
          alt={`${name}, Mie Ayam Surabaya`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {badge && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#8B0000] text-[#FFD700] shadow-md border border-[#D4AF37]/50">
            {badge}
          </span>
        )}
      </div>

      {/* Editorial card body */}
      <div className="flex-1 flex flex-col justify-between p-5">
        <div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2C1810] group-hover:text-[#8B0000] transition-colors duration-300 leading-snug">
            {name}
          </h3>
          {description && (
            <p className="section-body-unified text-[#6B4423] text-xs sm:text-sm mt-1.5 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 mt-4 pt-3.5 border-t border-stone-100">
          <PriceCounter
            value={price}
            className="font-heading text-xl font-bold text-[#8B0000]"
          />
          {isAvailable ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Pesan ${name} via WhatsApp (buka di tab baru)`}
              className="inline-flex items-center justify-center gap-1.5 bg-[#8B0000] hover:bg-[#C41E3A] text-[#FFD700] hover:text-white font-semibold text-xs px-4 py-2 rounded-full transition-all duration-300 ease-out hover:shadow-md hover:scale-105 active:scale-95 min-h-[40px]"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Pesan</span>
            </a>
          ) : (
            <span className="text-xs text-[#6B4423] px-3 py-1.5 bg-stone-100 rounded-full font-medium">
              Habis
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
