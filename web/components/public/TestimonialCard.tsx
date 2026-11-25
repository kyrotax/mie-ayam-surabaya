// TestimonialCard: quote + nama, background krem, quote mark besar sebagai aksen
interface TestimonialCardProps {
  nama: string;
  teks: string;
  rating?: number;
  asal?: string;
  source?: string;
}

export default function TestimonialCard({
  nama,
  teks,
  rating = 5,
  asal = "Pelanggan Terverifikasi",
  source = "Google Maps Review",
}: TestimonialCardProps) {
  return (
    <article className="bg-[#FAF0E6] rounded-[12px] p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between border border-[#8B1E1E]/10 shadow-sm">
      {/* Quote mark dekoratif */}
      <span
        className="absolute top-3 right-5 font-display text-8xl text-[#8B1E1E]/10 font-bold leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      <div>
        {/* Rating — bintang dari karakter teks */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex gap-0.5" aria-label={`Rating ${rating} dari 5 bintang`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < rating ? "text-[#8B1E1E]" : "text-stone-300"}`}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
          </div>

          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 bg-white/70 px-2 py-0.5 rounded-full border border-stone-200/60">
            {source}
          </span>
        </div>

        <blockquote>
          <p className="text-stone-700 font-sans text-sm sm:text-base leading-relaxed relative z-10">
            &ldquo;{teks}&rdquo;
          </p>
        </blockquote>
      </div>

      <footer className="mt-5 pt-3 border-t border-stone-200/60 flex items-center gap-3">
        {/* Inisial avatar */}
        <div
          className="w-10 h-10 rounded-full bg-[#8B1E1E] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm"
          aria-hidden="true"
        >
          {nama.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <cite className="not-italic font-bold text-stone-900 text-sm font-sans leading-tight">
            {nama}
          </cite>
          <span className="text-xs text-stone-500 font-sans mt-0.5">
            {asal}
          </span>
        </div>
      </footer>
    </article>
  );
}
