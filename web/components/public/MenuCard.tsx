import Image from "next/image";
import { MessageCircle, Star } from "lucide-react";
import PriceCounter from "./PriceCounter";

interface MenuCardProps {
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  badge?: string | null;
  isAvailable: boolean;
  waNumber: string;
  rating?: number;
}

function resolveMenuImageUrl(url?: string | null): string {
  if (!url) return "/images/mie-ayam-komplit.png";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("/images/")
  ) {
    return url;
  }
  return `/api/storage/${url.replace(/^\/+/, "")}`;
}

export default function MenuCard({
  name,
  description,
  price,
  imageUrl,
  badge,
  isAvailable,
  waNumber,
  rating = 5,
}: MenuCardProps) {
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Halo Mie Ayam Surabaya, saya ingin pesan ${name}.`
  )}`;
  const imgSrc = resolveMenuImageUrl(imageUrl);

  return (
    <article className="group h-full flex flex-col rounded-[22px] overflow-hidden bg-white border border-[#E8E2DC] shadow-[0_4px_16px_rgba(31,25,22,0.04)] hover:-translate-y-1 hover:border-[#D10B0C]/40 hover:shadow-[0_12px_28px_rgba(209,11,12,0.08)] transition-all duration-300">
      {/* Photo container 4:3 */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8F5F2]">
        <Image
          src={imgSrc}
          alt={`${name}, Mie Ayam Surabaya`}
          fill
          className="object-cover group-hover:scale-[1.04] transition-transform duration-300 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {badge && (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-gradient-to-r from-[#D10B0C] to-[#E52D2E] px-3 py-1 text-xs font-bold text-white shadow-xs">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-5">
        <div>
          <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1F1916] leading-snug group-hover:text-[#D10B0C] transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-[#6B5E55] mt-1.5 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 mt-5 pt-3.5 border-t border-[#E8E2DC]">
          <div className="flex flex-col">
            <div className="flex items-center gap-0.5 mb-0.5" aria-label={`Rating ${rating} dari 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(rating)
                      ? "fill-[#F59E0B] text-[#F59E0B]"
                      : "text-[#E8E2DC]"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            {price > 0 ? (
              <PriceCounter
                value={price}
                className="text-lg font-extrabold tracking-[-0.02em] text-[#D10B0C]"
              />
            ) : (
              <span className="text-base font-semibold text-[#6B5E55]">[ISI]</span>
            )}
          </div>

          {isAvailable ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Pesan ${name} via WhatsApp`}
              className="inline-flex items-center justify-center gap-1.5 rounded-[12px] bg-[#FFF5F5] border border-[#FFD9D9] text-[#D10B0C] hover:bg-gradient-to-r hover:from-[#D10B0C] hover:to-[#E52D2E] hover:text-white hover:border-[#D10B0C] font-semibold text-xs px-3.5 py-2.5 min-h-[40px] transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D10B0C]"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Pesan</span>
            </a>
          ) : (
            <span className="text-xs text-[#8C7E74] px-3 py-1.5 bg-[#F5F2EF] rounded-full font-medium">
              Habis
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
