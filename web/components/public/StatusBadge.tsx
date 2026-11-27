interface StatusBadgeProps {
  isOpen?: boolean;
  note?: string;
  className?: string;
  theme?: "default" | "onRed";
}

export default function StatusBadge({
  isOpen = true,
  note,
  className = "",
  theme = "default",
}: StatusBadgeProps) {
  const statusText = isOpen ? "Buka" : "Tutup";
  const labelText = note || (isOpen ? "Selasa–Minggu 13.00–Habis" : "Tutup sementara");
  const isOnRed = theme === "onRed";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-xs select-none ${
        isOnRed
          ? "border-white/20 bg-black/20 text-white backdrop-blur-xs"
          : "border-[#E8E2DC] bg-white text-[#1F1916]"
      } ${className}`}
      role="status"
      aria-label={`Status warung: ${statusText} · ${labelText}`}
    >
      <span
        className="h-2 w-2 rounded-full shrink-0"
        style={{ backgroundColor: isOpen ? "#22C55E" : (isOnRed ? "#FFFFFF" : "#D10B0C") }}
        aria-hidden="true"
      />
      <span className="font-bold">{statusText}</span>
      <span className={isOnRed ? "text-white/40" : "text-[#DCD5CD]"} aria-hidden="true">·</span>
      <span className={`truncate max-w-[180px] sm:max-w-none ${isOnRed ? "text-white/85" : "text-[#6B5E55]"}`}>{labelText}</span>
    </div>
  );
}
