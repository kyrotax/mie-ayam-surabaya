"use client";

import { Clock, CheckCircle2, XCircle } from "lucide-react";

export default function HoursTable() {
  return (
    <div className="rounded-[22px] border border-[#E8E2DC] bg-white p-5 space-y-4 shadow-[0_4px_16px_rgba(31,25,22,0.04)]">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D10B0C]">
        <Clock className="w-4 h-4 text-[#D10B0C]" aria-hidden="true" />
        <span>Jam Operasional Warung</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3 p-3.5 rounded-[14px] bg-[#FFF5F5] border border-[#FFD9D9]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-sm text-[#1F1916]">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" aria-hidden="true" />
              <span>Selasa – Minggu</span>
            </div>
            <p className="text-xs text-[#6B5E55]">
              Buka tiap hari kerja & akhir pekan
            </p>
          </div>
          <span className="text-sm font-bold text-[#D10B0C] text-right whitespace-nowrap">
            Jam 13.00 – Habis
          </span>
        </div>

        <div className="flex items-start justify-between gap-3 p-3.5 rounded-[14px] bg-[#FAF9F7] border border-[#E8E2DC]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-medium text-sm text-[#4B3E36]">
              <XCircle className="w-4 h-4 text-[#8C7E74] shrink-0" aria-hidden="true" />
              <span>Senin</span>
            </div>
            <p className="text-xs text-[#6B5E55]">
              Istirahat rutin mingguan
            </p>
          </div>
          <span className="text-sm font-semibold text-[#8C7E74] bg-[#E8E2DC]/70 px-2.5 py-0.5 rounded-full text-right whitespace-nowrap">
            Libur
          </span>
        </div>
      </div>

      <p className="text-xs text-[#6B5E55] pt-2 border-t border-[#E8E2DC] leading-relaxed">
        *Disarankan datang lebih awal atau pesan via WhatsApp untuk memastikan ketersediaan porsi.
      </p>
    </div>
  );
}
