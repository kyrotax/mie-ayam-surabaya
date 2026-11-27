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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fidpdnscwysqrcadagmq.supabase.co";
  return `${supabaseUrl}/storage/v1/object/public/mie-ayam-surabaya/${url}`;
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
    <article className="group h-full flex flex-col rounded-[20px] overflow-hidden bg-white border border-[#DCD5CD] shadow-[0_4px_14px_rgba(46,31,21,0.03)] hover:-translate-y-0.5 hover:border-[#8D0D00]/40 transition-all duration-300">
      {/* Photo container 4:3 */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F0EB]">
        <Image
          src={imgSrc}
          alt={`${name}, Mie Ayam Surabaya`}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {badge && (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full border border-[#E3C1BA] bg-[#F3E4DE] px-3 py-1 text-xs font-semibold text-[#8D0D00]">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-5">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#251C17] leading-snug">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-[#6E6259] mt-1.5 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 mt-5 pt-3.5 border-t border-[#E3DDD6]">
          <div className="flex flex-col">
            <div className="flex items-center gap-0.5 mb-0.5" aria-label={`Rating ${rating} dari 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(rating)
                      ? "fill-[#D6AC58] text-[#D6AC58]"
                      : "text-[#DCD5CD]"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            {price > 0 ? (
              <PriceCounter
                value={price}
                className="text-base font-semibold tracking-[-0.02em] text-[#251C17]"
              />
            ) : (
              <span className="text-base font-semibold text-[#6E6259]">[ISI]</span>
            )}
          </div>

          {isAvailable ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Pesan ${name} via WhatsApp`}
              className="inline-flex items-center justify-center gap-1.5 rounded-[12px] bg-white border border-[#DCD5CD] text-[#251C17] hover:bg-[#F4F0EB] font-semibold text-xs px-3.5 py-2.5 min-h-[40px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D0D00]"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#8D0D00] shrink-0" aria-hidden="true" />
              <span>Pesan</span>
            </a>
          ) : (
            <span className="text-xs text-[#6E6259] px-3 py-1.5 bg-[#F4F0EB] rounded-full font-medium">
              Habis
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
