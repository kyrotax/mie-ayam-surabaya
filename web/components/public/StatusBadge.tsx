interface StatusBadgeProps {
  isOpen?: boolean;
  note?: string;
  className?: string;
}

export default function StatusBadge({
  isOpen = true,
  note,
  className = "",
}: StatusBadgeProps) {
  const statusText = isOpen ? "Buka" : "Tutup";
  const labelText = note || (isOpen ? "Selasa–Minggu 13.00–Habis" : "Tutup sementara");

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-[#DCD5CD] bg-white px-3 py-1 text-xs font-medium text-[#251C17] select-none ${className}`}
      role="status"
      aria-label={`Status warung: ${statusText} · ${labelText}`}
    >
      <span
        className="h-2 w-2 rounded-full shrink-0"
        style={{ backgroundColor: isOpen ? "#2F7D4F" : "#8D0D00" }}
        aria-hidden="true"
      />
      <span className="font-semibold">{statusText}</span>
      <span className="text-[#DCD5CD]" aria-hidden="true">·</span>
      <span className="text-[#6E6259] truncate max-w-[180px] sm:max-w-none">{labelText}</span>
    </div>
  );
}
