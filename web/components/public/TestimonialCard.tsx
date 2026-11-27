import { Star } from "lucide-react";
import { siteConfig } from "@/data/site.config";

interface TestimonialCardProps {
  nama: string;
  teks: string;
  rating?: number;
  mapsUrl?: string;
  asal?: string;
  highlighted?: boolean;
}

export default function TestimonialCard({
  nama,
  teks,
  rating = 5,
  mapsUrl,
  asal = "Ulasan Google Maps",
  highlighted = false,
}: TestimonialCardProps) {
  const targetUrl = mapsUrl || siteConfig.kontak.mapsLink;

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block h-full rounded-[20px] md:rounded-[24px] p-6 md:p-8 flex flex-col justify-between border border-[#DCD5CD] shadow-[0_4px_14px_rgba(46,31,21,0.03)] hover:-translate-y-0.5 hover:border-[#8D0D00]/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D0D00] ${
        highlighted ? "bg-[#F3E4DE]" : "bg-white"
      }`}
      aria-label={`Ulasan dari ${nama} di Google Maps`}
    >
      <div>
        <div className="flex items-center gap-0.5 mb-4" aria-label={`Rating ${rating} dari 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? "fill-[#D6AC58] text-[#D6AC58]" : "text-[#DCD5CD]"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        <blockquote>
          <p className="text-base leading-relaxed text-[#443831]">
            &ldquo;{teks}&rdquo;
          </p>
        </blockquote>
      </div>

      <footer className="mt-6 pt-4 border-t border-[#E3DDD6]">
        <cite className="not-italic font-semibold text-sm text-[#251C17] block">
          {nama}
        </cite>
        <span className="text-xs text-[#6E6259]">{asal}</span>
      </footer>
    </a>
  );
}
