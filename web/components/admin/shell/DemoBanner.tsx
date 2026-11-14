import React from "react";
import { Info } from "lucide-react";

export function DemoBanner() {
  const isDummy = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  if (!isDummy) return null;

  return (
    <div className="bg-[#F4CE90] text-[#3B2416] px-4 py-1.5 text-xs font-semibold text-center border-b border-[#CBA857] flex items-center justify-center gap-1.5">
      <Info className="w-3.5 h-3.5 text-[#8D0D00]" />
      <span>Mode demo: data contoh, tidak tersimpan ke server.</span>
    </div>
  );
}
