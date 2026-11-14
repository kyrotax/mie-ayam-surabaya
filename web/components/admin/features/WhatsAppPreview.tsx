import React from "react";
import { MessageSquare, CheckCheck } from "lucide-react";

export function WhatsAppPreview({
  message,
  time = "14.30",
}: {
  message: string;
  time?: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#3B2416]/10 shadow-sm bg-[#EFEAE2]">
      {/* WA Header */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
          MA
        </div>
        <div>
          <div className="text-xs font-bold leading-tight">Mie Ayam Surabaya (Bot)</div>
          <div className="text-[10px] text-white/80">Akun Bisnis Resmi</div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="p-4 space-y-3 min-h-[160px] bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:12px_12px]">
        {/* Pesan Masuk Pelanggan */}
        <div className="flex justify-start">
          <div className="bg-white text-[#1C1917] p-3 rounded-xl rounded-tl-none max-w-[85%] text-xs shadow-xs space-y-1">
            <p>Halo, warung masih buka kah?</p>
            <div className="text-[9px] text-[#64748B] text-right">14.29</div>
          </div>
        </div>

        {/* Balasan Otomatis Bot */}
        <div className="flex justify-end">
          <div className="bg-[#DCF8C6] text-[#1C1917] p-3 rounded-xl rounded-tr-none max-w-[90%] text-xs shadow-xs space-y-1.5 border border-[#BDE89E]/40">
            <p className="whitespace-pre-line leading-relaxed">{message}</p>
            <div className="flex items-center justify-end gap-1 text-[9px] text-[#64748B]">
              <span>{time}</span>
              <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

