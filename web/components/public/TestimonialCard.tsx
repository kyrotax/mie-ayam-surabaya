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
      className={`group block h-full rounded-[22px] md:rounded-[26px] p-6 md:p-8 flex flex-col justify-between shadow-[0_4px_16px_rgba(31,25,22,0.03)] hover:-translate-y-1 hover:border-[#D10B0C]/40 hover:shadow-[0_12px_28px_rgba(209,11,12,0.08)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D10B0C] ${
        highlighted ? "bg-[#FFF8F8] border border-[#FFD9D9]" : "bg-white border border-[#E8E2DC]"
      }`}
      aria-label={`Ulasan dari ${nama} di Google Maps`}
    >
      <div>
        <div className="flex items-center gap-0.5 mb-4" aria-label={`Rating ${rating} dari 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? "fill-[#F59E0B] text-[#F59E0B]" : "text-[#E8E2DC]"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        <blockquote>
          <p className="text-base leading-relaxed text-[#4B3E36]">
            &ldquo;{teks}&rdquo;
          </p>
        </blockquote>
      </div>

      <footer className="mt-6 pt-4 border-t border-[#E8E2DC]">
        <cite className="not-italic font-bold text-sm text-[#1F1916] group-hover:text-[#D10B0C] transition-colors block">
          {nama}
        </cite>
        <span className="text-xs text-[#7D6B60]">{asal}</span>
      </footer>
    </a>
  );
}
