import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export function ErrorState({
  title = "Terjadi Kesalahan",
  message = "Gagal memuat data. Silakan coba beberapa saat lagi.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="py-10 px-6 flex flex-col items-center justify-center text-center bg-[#FBE4E1]/40 rounded-2xl border border-[#F4BEB7]">
      <div className="w-12 h-12 rounded-full bg-[#FBE4E1] text-[#B42318] flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-base font-bold text-[#3B2416] mb-1">{title}</h3>
      <p className="text-sm text-[#6B5240] max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#B42318]/30 hover:bg-[#FBE4E1] text-[#B42318] text-xs font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Coba Lagi</span>
        </button>
      )}
    </div>
  );
}
