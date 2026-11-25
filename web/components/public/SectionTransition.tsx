interface SectionTransitionProps {
  fromColor: string;
  toColor: string;
  className?: string;
}

/**
 * Transisi gradasi antar section setinggi 120px untuk memperhalus perpindahan warna antar section secara bersih.
 */
export default function SectionTransition({
  fromColor,
  toColor,
  className = "",
}: SectionTransitionProps) {
  return (
    <div
      className={`relative w-full h-[120px] bg-gradient-to-b ${fromColor} ${toColor} pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
}

