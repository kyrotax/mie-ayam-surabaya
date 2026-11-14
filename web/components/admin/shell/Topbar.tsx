"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SessionUser, StoreStatus } from "@/lib/admin/types";
import { UserMenu } from "./UserMenu";
import { Menu, ExternalLink } from "lucide-react";
import { getStoreStatusService } from "@/lib/admin/services/status-service";
import { subscribeToStore } from "@/lib/admin/mock/store";

export function Topbar({
  user,
  onOpenMobileMenu,
  title,
}: {
  user: SessionUser;
  onOpenMobileMenu: () => void;
  title?: string;
}) {
  const [status, setStatus] = useState<StoreStatus | null>(null);

  const loadStatus = async () => {
    try {
      const data = await getStoreStatusService();
      setStatus(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadStatus();
    const unsubscribe = subscribeToStore(() => {
      loadStatus();
    });
    return unsubscribe;
  }, []);

  const isOpen = status ? status.isOpen : true;

  return (
    <header className="h-16 bg-[#FAF8F5] border-b border-[#3B2416]/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Kiri: Hamburger (Mobile) + Judul */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl border border-[#3B2416]/15 text-[#3B2416] hover:bg-black/5 transition"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h2 className="font-serif font-bold text-lg sm:text-xl text-[#3B2416] truncate">
            {title}
          </h2>
        )}
      </div>

      {/* Kanan: Chip Status Toko, Lihat Situs, UserMenu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Chip Status Toko */}
        <Link
          href="/admin/toko"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
            isOpen
              ? "bg-[#E4F2E5] text-[#276B2B] border-[#C2E4C4] hover:bg-[#d8eed9]"
              : "bg-[#FBE4E1] text-[#B42318] border-[#F4BEB7] hover:bg-[#fad8d4]"
          }`}
          title="Klik untuk ubah status toko"
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              isOpen ? "bg-[#2E7D32]" : "bg-[#B42318]"
            }`}
          />
          <span>{isOpen ? "Warung Buka" : "Warung Tutup"}</span>
        </Link>

        {/* Tautan Lihat Situs */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#8D0D00] hover:text-[#6B0A00] px-2.5 py-1.5 rounded-lg hover:bg-black/5 transition"
        >
          <span>Lihat Situs</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Menu Pengguna */}
        <UserMenu user={user} />
      </div>
    </header>
  );
}
