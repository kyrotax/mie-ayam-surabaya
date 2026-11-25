import { ExternalLink } from "lucide-react";
import { siteConfig } from "@/data/site.config";

interface TestimonialCardProps {
  nama: string;
  teks: string;
  rating?: number;
  mapsUrl?: string;
  asal?: string;
}

export default function TestimonialCard({
  nama,
  teks,
  rating = 5,
  mapsUrl,
  asal = "Pelanggan Google Maps",
}: TestimonialCardProps) {
  const targetUrl = mapsUrl || siteConfig.kontak.mapsLink;

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full bg-white rounded-xl p-6 relative flex flex-col justify-between border border-stone-200/90 shadow-sm hover:border-[#D4AF37] hover:-translate-y-[6px] hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer [backface-visibility:hidden]"
      aria-label={`Ulasan dari ${nama} di Google Maps (Buka di tab baru)`}
    >
      {/* Header: Stars + Google Maps source pill */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex gap-0.5" aria-label={`Rating ${rating} dari 5 bintang`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < rating ? "text-[#D4AF37]" : "text-stone-300"}`}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF6EE] border border-stone-200 text-[10px] font-semibold text-[#8B0000] group-hover:bg-[#8B0000] group-hover:text-[#FFD700] transition-colors">
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
          </div>
        </div>

        <blockquote>
          <p className="section-body-unified text-[#2C1810] group-hover:text-black transition-colors">
            &ldquo;{teks}&rdquo;
          </p>
        </blockquote>
      </div>

      {/* Footer: Reviewer info */}
      <footer className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full bg-[#8B0000] text-[#FFD700] flex items-center justify-center font-heading font-bold text-xs shrink-0 group-hover:bg-[#C41E3A] transition-colors"
            aria-hidden="true"
          >
            {nama.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <cite className="not-italic font-medium text-[#2C1810] text-sm font-sans leading-tight">
              {nama}
            </cite>

          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#8B0000] underline underline-offset-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Lihat Ulasan
        </span>
      </footer>
    </a>
  );
}
