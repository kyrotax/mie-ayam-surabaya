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
    <header className="h-16 bg-[#FFF8E7] border-b border-[#D4AF37]/30 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Kiri: Hamburger (Mobile) + Judul */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl border border-[#2C1810]/15 text-[#2C1810] hover:bg-[#D4AF37]/10 transition"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h2 className="font-heading text-2xl font-bold text-[#2C1810] tracking-wide truncate">
            {title}
          </h2>
        )}
      </div>

      {/* Kanan: Chip Status Toko, Lihat Situs, UserMenu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Chip Status Toko */}
        <Link
          href="/admin/toko"
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition font-subheading ${
            isOpen
              ? "bg-[#E4F2E5] text-[#276B2B] border-[#C2E4C4] hover:bg-[#d8eed9]"
              : "bg-[#FBE4E1] text-[#C41E3A] border-[#F4BEB7] hover:bg-[#fad8d4]"
          }`}
          title="Klik untuk ubah status toko"
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              isOpen ? "bg-[#2E7D32]" : "bg-[#C41E3A]"
            }`}
          />
          <span>{isOpen ? "Warung Buka" : "Warung Tutup"}</span>
        </Link>

        {/* Tautan Lihat Situs */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#8B0000] hover:text-[#C41E3A] px-3 py-1.5 rounded-full border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 transition font-subheading"
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

