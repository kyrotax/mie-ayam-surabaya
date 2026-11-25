"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Menu } from "lucide-react";
import type { SessionUser, StoreStatus } from "@/lib/admin/types";
import { getStoreStatusService } from "@/lib/admin/services/status-service";
import { subscribeToStore } from "@/lib/admin/mock/store";
import { DemoBanner } from "./DemoBanner";
import { UserMenu } from "./UserMenu";

export function Topbar({
  user,
  onOpenMobileMenu,
}: {
  user: SessionUser;
  onOpenMobileMenu: () => void;
}) {
  const [status, setStatus] = useState<StoreStatus | null>(null);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        setStatus(await getStoreStatusService());
      } catch {
        setStatus(null);
      }
    };

    void loadStatus();
    return subscribeToStore(() => void loadStatus());
  }, []);

  return (
    <header className="mx-auto flex w-full max-w-[1540px] items-center justify-between gap-3 px-4 pt-3 sm:px-6 sm:pt-4 xl:px-8">
      <div className="flex min-h-12 items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex h-11 min-w-11 items-center justify-center rounded-[13px] border border-[#D5CEC5] bg-white text-[#251C17] shadow-[0_6px_18px_rgba(46,31,21,0.06)] transition-colors hover:border-[#8D0D00] hover:text-[#8D0D00]"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
        </button>
        <span className="text-sm font-semibold tracking-[-0.02em]">Mie Ayam Surabaya</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-1 rounded-[13px] border border-[#DCD5CD] bg-white p-1 shadow-[0_6px_18px_rgba(46,31,21,0.05)] sm:flex">
          <DemoBanner />
        <Link
          href="/admin/toko"
          className="flex min-h-9 items-center gap-2 rounded-[9px] bg-[#F3F0EC] px-3 text-xs font-semibold text-[#3F352E] transition-colors hover:bg-[#E9E4DE] hover:text-[#8D0D00]"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              status?.isOpen ? "bg-[#2E7D32]" : status ? "bg-[#8D0D00]" : "bg-[#81746B]"
            }`}
            aria-hidden="true"
          />
          <span className="hidden sm:inline">
            {status?.isOpen ? "Warung buka" : status ? "Warung tutup" : "Memuat status"}
          </span>
          <span className="sm:hidden">Status</span>
        </Link>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden min-h-9 items-center gap-2 rounded-[9px] px-3 text-xs font-semibold text-[#5A4D44] transition-colors hover:bg-[#F3F0EC] hover:text-[#8D0D00] md:flex"
        >
          <span className="hidden xl:inline">Lihat situs</span>
          <ExternalLink className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          <span className="sr-only xl:hidden">Lihat situs</span>
        </a>
        </div>
        <div className="rounded-[13px] border border-[#DCD5CD] bg-white p-1 shadow-[0_6px_18px_rgba(46,31,21,0.05)]">
          <UserMenu user={user} compact />
        </div>
      </div>
    </header>
  );
}
