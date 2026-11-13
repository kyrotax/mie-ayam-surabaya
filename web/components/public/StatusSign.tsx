"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface StatusData {
  isOpen: boolean;
  statusNote: string | null;
  nextOpenText: string | null;
}

export default function StatusSign({ initialData }: { initialData?: StatusData }) {
  const [data, setData] = useState<StatusData>(
    initialData || { isOpen: true, statusNote: null, nextOpenText: null }
  );

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/status");
      if (res.ok) {
        const json = await res.json();
        setData({
          isOpen: json.isOpen,
          statusNote: json.statusNote,
          nextOpenText: json.nextOpenText,
        });
      }
    } catch {
      // Keep previous state gracefully
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchStatus, 60000);
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchStatus();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const isOpen = data.isOpen;

  return (
    <div
      className="inline-flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-stone-200/90 shadow-sm text-xs font-sans text-stone-700"
      aria-live="polite"
      aria-label={`Status operasional warung: ${isOpen ? "Buka" : "Tutup"}`}
    >
      {/* Live Pulsing Indicator */}
      <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOpen ? "bg-emerald-400" : "bg-red-400"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            isOpen ? "bg-emerald-600" : "bg-red-600"
          }`}
        />
      </span>

      {/* Oriental Seal Badge */}
      <span
        className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase text-white ${
          isOpen ? "bg-[#3F7D3A]" : "bg-[#BA382A]"
        }`}
      >
        {isOpen ? "BUKA SEKARANG" : "TUTUP SEMENTARA"}
      </span>

      <span className="text-stone-300 hidden sm:inline" aria-hidden="true">|</span>

      {/* Status Detail & Hours */}
      <div className="flex items-center gap-1.5 text-stone-600 font-medium">
        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" aria-hidden="true" />
        <span>
          {isOpen
            ? (data.statusNote || "09.00 sampai 21.00 WIB")
            : (data.nextOpenText || "Buka kembali besok pukul 09.00 WIB")}
        </span>
      </div>
    </div>
  );
}
