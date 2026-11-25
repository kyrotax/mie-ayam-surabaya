interface StatusBadgeProps {
  isOpen?: boolean;
  className?: string;
}

export default function StatusBadge({
  isOpen = true,
  className = "",
}: StatusBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 text-xs font-medium tracking-wide text-white/90 select-none ${className}`}
      role="status"
      aria-label={isOpen ? "Status warung: Buka (Open)" : "Status warung: Tutup (Closed)"}
    >
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-xs transition-colors ${
          isOpen
            ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400/50"
            : "bg-red-500/25 text-red-300 border border-red-400/50"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isOpen ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-red-400"
          }`}
          aria-hidden="true"
        />
        {isOpen ? "Open" : "Closed"}
      </span>
      <span className="text-xs text-white/80 font-normal hidden sm:inline">
        {isOpen ? "Selasa - Minggu: 13.00 - Habis" : "Buka kembali hari Selasa"}
      </span>
    </div>
  );
}

