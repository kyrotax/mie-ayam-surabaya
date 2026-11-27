"use client";

import { Clock, CheckCircle2, XCircle } from "lucide-react";

export default function HoursTable() {
  return (
    <div className="rounded-[20px] border border-[#DCD5CD] bg-white p-5 space-y-4 shadow-[0_4px_14px_rgba(46,31,21,0.03)]">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8D0D00]">
        <Clock className="w-4 h-4 text-[#8D0D00]" aria-hidden="true" />
        <span>Jam Operasional Warung</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3 p-3.5 rounded-[14px] bg-[#FAF9F7] border border-[#E3DDD6]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-semibold text-sm text-[#251C17]">
              <CheckCircle2 className="w-4 h-4 text-[#2F7D4F] shrink-0" aria-hidden="true" />
              <span>Selasa – Minggu</span>
            </div>
            <p className="text-xs text-[#6E6259]">
              Buka tiap hari kerja & akhir pekan
            </p>
          </div>
          <span className="text-sm font-semibold text-[#8D0D00] text-right whitespace-nowrap">
            Jam 13.00 – Habis
          </span>
        </div>

        <div className="flex items-start justify-between gap-3 p-3.5 rounded-[14px] bg-[#FAF9F7] border border-[#E3DDD6]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-medium text-sm text-[#443831]">
              <XCircle className="w-4 h-4 text-[#8C827A] shrink-0" aria-hidden="true" />
              <span>Senin</span>
            </div>
            <p className="text-xs text-[#6E6259]">
              Istirahat rutin mingguan
            </p>
          </div>
          <span className="text-sm font-semibold text-[#8C827A] bg-[#E3DDD6]/60 px-2.5 py-0.5 rounded-full text-right whitespace-nowrap">
            Libur
          </span>
        </div>
      </div>

      <p className="text-xs text-[#6E6259] pt-2 border-t border-[#E3DDD6] leading-relaxed">
        *Disarankan datang lebih awal atau pesan via WhatsApp untuk memastikan ketersediaan porsi.
      </p>
    </div>
  );
}
