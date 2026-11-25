"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import type { SessionUser } from "@/lib/admin/types";
import { logoutAction } from "@/app/admin/login/actions";

export function UserMenu({ user, compact = false }: { user: SessionUser; compact?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex min-h-9 items-center gap-2 rounded-[11px] transition-colors hover:bg-[#F3F0EC] ${compact ? "px-1" : "px-1.5 sm:px-2.5"}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#8D0D00] text-[11px] font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-32 truncate text-xs font-semibold text-[#251C17] 2xl:block">
          {user.name}
        </span>
        <ChevronDown className="hidden h-4 w-4 text-[#6E6259] sm:block" strokeWidth={1.8} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 rounded-[16px] border border-[#D8D1C9] bg-white p-2 shadow-[0_18px_50px_rgba(63,36,22,0.14)]"
        >
          <div className="border-b border-[#E7E1DA] px-3 pb-3 pt-2">
            <p className="truncate text-sm font-semibold text-[#251C17]">{user.name}</p>
            <p className="mt-1 truncate text-xs text-[#6E6259]">{user.email}</p>
          </div>
          <form action={logoutAction} className="pt-2">
            <button
              type="submit"
              role="menuitem"
              className="flex min-h-11 w-full items-center gap-2.5 rounded-[10px] px-3 text-left text-xs font-semibold text-[#8D0D00] transition-colors hover:bg-[#F8ECE8]"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              Keluar dari panel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
