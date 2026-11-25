// StatusBadge: "Warung Buka" / "Warung Tutup"
interface StatusBadgeProps {
  isOpen?: boolean;
  note?: string;
  className?: string;
}

export default function StatusBadge({
  isOpen = true,
  note = "Yuk mampir!",
  className = "",
}: StatusBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-md backdrop-blur-sm transition-colors ${
        isOpen
          ? "bg-emerald-900/80 text-emerald-100 border border-emerald-500/40"
          : "bg-stone-800/80 text-stone-300 border border-stone-600/40"
      } ${className}`}
      aria-label={`Status warung: ${isOpen ? "Warung Sedang Buka" : "Warung Sedang Tutup"}`}
      role="status"
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isOpen ? "bg-emerald-400 animate-pulse" : "bg-stone-400"
        }`}
        aria-hidden="true"
      />
      <span>{isOpen ? "Warung Sedang Buka" : "Warung Sedang Tutup"}</span>
      {note && (
        <>
          <span className="opacity-40" aria-hidden="true">·</span>
          <span className="text-[11px] font-medium text-emerald-200">
            {note}
          </span>
        </>
      )}
    </div>
  );
}
