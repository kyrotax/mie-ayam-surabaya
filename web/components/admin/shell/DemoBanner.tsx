import React from "react";
import { Info } from "lucide-react";

export function DemoBanner() {
  const isDummy = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  if (!isDummy) return null;

  return (
    <div className="bg-[#FFD700] text-[#2C1810] px-4 py-1.5 text-xs font-semibold text-center border-b border-[#D4AF37] flex items-center justify-center gap-1.5">
      <Info className="w-3.5 h-3.5 text-[#8B0000]" />
      <span>Mode demo: data contoh, tidak tersimpan ke server.</span>
    </div>
  );
}

