"use client";

import { Menu } from "lucide-react";
import type { SessionUser } from "@/lib/admin/types";

export function Topbar({
  onOpenMobileMenu,
}: {
  user: SessionUser;
  onOpenMobileMenu: () => void;
}) {
  return (
    <header className="flex min-h-16 items-center gap-3 border-b border-[#DDD7D0] bg-[#FAF9F7] px-4 lg:hidden">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="flex h-11 min-w-11 items-center justify-center rounded-[11px] border border-[#D5CEC5] bg-white text-[#251C17] transition-colors hover:border-[#8D0D00] hover:text-[#8D0D00]"
        aria-label="Buka menu navigasi"
      >
        <Menu className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </button>
      <div>
        <p className="text-sm font-semibold tracking-[-0.02em]">Mie Ayam Surabaya</p>
        <p className="text-[11px] text-[#74675E]">Panel Owner</p>
      </div>
    </header>
  );
}
